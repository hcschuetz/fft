const decodeBase64 = (base64String: string): Uint8Array => {
  const binaryString = atob(base64String);
  return Uint8Array.from(
    {length: binaryString.length},
    (_, i) => binaryString.charCodeAt(i),
  );
};

export default decodeBase64;
