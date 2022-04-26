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

  const outputFullBlocksLimit = 3 / 4 * fullBlocksLimit;
  const outputRestSize = rests[restSize];
  const output = new Uint8Array(outputFullBlocksLimit + outputRestSize);

  let i = 0, o = 0;
  while (i < fullBlocksLimit) {
    const blockValue =
      (values[input[i++]] << 18) |
      (values[input[i++]] << 12) |
      (values[input[i++]] <<  6) |
      (values[input[i++]] <<  0);
    output[o++] = blockValue >> 16;
    output[o++] = blockValue >>  8;
    output[o++] = blockValue >>  0;
  }
  switch (outputRestSize) {
    case 2:
      output[outputFullBlocksLimit + 1] =
        (values[input[fullBlocksLimit + 1]] << 4) |
        (values[input[fullBlocksLimit + 2]] >> 2);
      // fall through
    case 1:
      output[outputFullBlocksLimit] =
        (values[input[fullBlocksLimit + 0]] << 2) |
        (values[input[fullBlocksLimit + 1]] >> 4);
  }
  return output;
};

export default decodeBase64;
