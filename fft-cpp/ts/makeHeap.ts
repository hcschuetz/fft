type Region = {
  start: number,
  end: number,
  length: number,
}

// Not the most simplistic but still quite simple heap implementation
// TODO Use a third-party library? Which one?
// Otherwise this deserves more thorough testing beyond the selfCheck
// (OTOH our use case would get by without merging of free regions.)
export
function makeHeap(
  memory: WebAssembly.Memory,
  start: number,
  {shouldSelfCheck = false}: {shouldSelfCheck?: boolean | "quiet"} = {}
) {
  let end = start;
  const allocatedRegions: Map<number, Region> = new Map();
  const freeRegions: Region[] = [];

  function selfCheck(situation: string) {
    function fail(strings: TemplateStringsArray, ...args: Object[]) {
      const texts = [strings[0]];
      for (let i = 0; i < args.length; i++) {
        texts.push(strings[i], JSON.stringify(args[i]));
      }
      throw new Error(`internal error upon ${situation}: ${texts.join("")}`);
    }

    if (memory.buffer.byteLength < end) {
      fail`less than ${end} bytes allocated: ${memory.buffer.byteLength}`;
    }

    for (let i = 1; i < freeRegions.length; i++) {
      if (freeRegions[i-1].start >= freeRegions[i].start) {
        fail`sort order of free regions violated: ${freeRegions[i-1]}, ${freeRegions[i]}`;
      }
    }

    const allRegions = [
      ...freeRegions.map(r => ({r, free: true})),
      ...[...allocatedRegions.values()].map(r => ({r, free: false})),
    ].sort((a, b) => a.r.start - b.r.start);
    if (shouldSelfCheck !== "quiet") {
      console.log("heap self-check", situation, allRegions, end);
    }

    for (const regFree of allRegions) {
      const {start, length, end} = regFree.r;
      if (!(length > 0)) {
        fail`memory region with non-positive length ${regFree}`;
      }
      if (length & 15) {
        fail`memory region with unaligned length ${regFree}`;
      }
      if (start & 15) {
        fail`memory region with unaligned address ${regFree}`;
      }
      if (!(end === start + length)) {
        fail`inconsistent memory region ${regFree}`;
      }
    }
    if (allRegions.length === 0) {
      if (end !== start) {
        fail`no regions but end (${end}) !== start (${start})`;
      }
      return;
    }
    if (allRegions[0].r.start !== start) {
      fail`first memory region ${allRegions[0]} does not start at ${start}`;
    }
    for (let i = 1; i < allRegions.length; i++) {
      if (allRegions[i].r.start !== allRegions[i-1].r.end) {
        fail`non-adjacent memory region ${allRegions[i]}`;
      }
      if (allRegions[i-1].free && allRegions[i].free) {
        fail`adjacent free memory regions: ${allRegions[i-1]}, ${allRegions[i]}`;
      }
    }
    if (allRegions[allRegions.length - 1].r.end !== end) {
      fail`last memory region ${allRegions[allRegions.length - 1]} does not end at ${end}`;
    }
    if (allRegions[allRegions.length - 1].free) {
      fail`last memory region is free`;
    }
  }

  function ensureMemoryUntil(end: number): void {
    const diff = end - memory.buffer.byteLength;
    if (diff > 0) {
      memory.grow((diff + ((1 << 16) - 1)) >> 16);
      if (shouldSelfCheck === true) {
        console.log("grown to", memory.buffer.byteLength);
      }
    }
  }

  function malloc(length: number): number {
    if (length === 0) {
      length = 1; // so that regions have unique (start) addresses
    }
    length = (length + 15) & -16; // alignment/granularity 16; is this a good choice?
    let candidateIdx = -1;
    for (let i = 0; i < freeRegions.length; i++) {
      const r = freeRegions[i];
      if (
        r.length >= length &&
        (candidateIdx < 0 || r.length < freeRegions[candidateIdx].length)
      ) {
        candidateIdx = i;
        if (r.length === length) break; // just an optimization;
      }
    }
    if (candidateIdx < 0) {
      // no candidate found; create new region at the end
      const start = end;
      end += length;
      // if growing fails, standard malloc would return NULL;
      // we just let the exception thrown by memory.grow pass;
      ensureMemoryUntil(end);
      allocatedRegions.set(start, {start, length, end});
      return start;
    } else if (freeRegions[candidateIdx].length === length) {
      // candidate with precisely fitting length found; allocate it
      const [candidate] = freeRegions.splice(candidateIdx, 1);
      allocatedRegions.set(candidate.start, candidate);
      return candidate.start;
    } else {
      // candidate with too much memory found; split it
      const candidate = freeRegions[candidateIdx];
      const {start} = candidate;
      const end = start + length;
      candidate.start = end;
      candidate.length -= length;
      allocatedRegions.set(start, {start, length, end});
      return start;
    }
  }

  function free(addr: number): void {
    const r = allocatedRegions.get(addr);
    if (!r) {
      throw new Error(`attempt to free unallocated memory at ${addr}`);
    }
    allocatedRegions.delete(addr);
    for (let i = 0; i < freeRegions.length; i++) {
      const ri = freeRegions[i];
      if (ri.start > r.end) {
        // we are beyond our freed region r; so insert it:
        freeRegions.splice(i, 0, r);
        return;
      }
      if (ri.end === r.start) {
        // merge ri into r:
        freeRegions.splice(i--, 1);
        r.start = ri.start;
        r.length += ri.length;
        continue;
      }
      if (ri.start === r.end) {
        // merge ri into r:
        freeRegions.splice(i--, 1);
        r.end += ri.length;
        r.length += ri.length;
      }
    }
    if (r.end === end) {
      end = r.start;
    } else {
      freeRegions.push(r);
    }
  }

  ensureMemoryUntil(start);

  if (shouldSelfCheck) {
    selfCheck("initialization");
    return  {
      memory,
      malloc: (length: number) => {
        const addr = malloc(length);
        selfCheck(`malloc(${length})`);
        return addr;
      },
      free: (addr: number) => {
        free(addr);
        selfCheck(`free(${addr})`);
      },
    };
  } else {
    return {memory, malloc, free};
  }
}
