const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const values: Record<string, number> = {};

for (let i = 0; i < chars.length; i++) {
  values[chars[i]] = i;
}

const rests = [0, 0, 1, 2];

// We should use some de-facto standard implementation
const decodeBase64 = (base64String: string): Uint8Array => {
  const input = base64String.replace(/\s+/g, "").replace(/=+$/, "");
  const restSize = input.length % 4;
  const fullBlocksLimit = input.length - restSize;

  const output = new Uint8Array(3 / 4 * fullBlocksLimit + rests[restSize]);
  let o = 0;
  for (let i = 0; i < fullBlocksLimit;) {
    const blockValue =
      (values[input[i++]] << 18) |
      (values[input[i++]] << 12) |
      (values[input[i++]] <<  6) |
      (values[input[i++]] <<  0);
    output[o++] = blockValue >> 16;
    output[o++] = blockValue >>  8;
    output[o++] = blockValue >>  0;
  }
  switch (restSize) {
    case 0: break;
    case 1: throw new Error("unexpected base64 length");
    case 2: {
      output[o++] =
        (values[input[fullBlocksLimit + 0]] << 2) |
        (values[input[fullBlocksLimit + 1]] >> 4);
      break;
    }
    case 3: {
      output[o++] =
        (values[input[fullBlocksLimit + 0]] << 2) |
        (values[input[fullBlocksLimit + 1]] >> 4);
      output[o++] =
        (values[input[fullBlocksLimit + 1]] << 4) |
        (values[input[fullBlocksLimit + 2]] >> 2);
      break;
    }
  }
  return output;
};

export default decodeBase64;
