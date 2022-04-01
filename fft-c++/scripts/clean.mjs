import { rm } from "fs/promises";

const paths = `
src/selectImpl.h++
dst
dst-native
dst-js-node
dst-wasm-node
dst-js-web
dst-wasm-web
test/bin
`.trim().split(/\n|\r\n?/).map(line => line.trim());

async function main() {
  try {
    for (const path of paths) {
      await rm(path, {recursive: true, force: true});
    }
  } catch (e) {
    console.error("Problem in clean script: ", e);
  }
}

main();
