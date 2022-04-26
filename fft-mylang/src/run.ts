import { versions } from "./api.js";

// TODO extend this to correctness/performance test

async function main() {
  for (const [name, version] of Object.entries(versions)) {
    console.log("======", name, "======");
    const factory = await version();
    for (const size of [4, 8, 16, 32, 512, 2048]) {
      console.log("------", size, "------");
      const fft = factory(size);

      for (let i = 0; i < size; i++) {
        fft.setInput(i, {
          re: 2 * i + 1,
          im: 2 * i + 2,
        });
      }
      fft.run();
      for (let i = 0; i < size; i++) {
        fft.setInput(i, fft.getOutput(i));
      }
      fft.run(-1);
      const output = new Array(2 * size);
      for (let i = 0; i < size; i++) {
        const z = fft.getOutput(i);
        output[2 * i + 0] = z.re;
        output[2 * i + 1] = z.im;
      }
      console.log(output.map(x => Number.parseFloat((x/size).toFixed(10))));    
    }
  }
}

main();
