#!/usr/bin/env node
import { spawn } from "child_process";
import { mkdir, readdir } from "fs/promises";

async function spawnCommand(cmd, args) {
  // console.log("spawn:", [cmd, ...args].join(" "));
  await new Promise((resolve, reject) => {
    const child = spawn(cmd, args);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.on('close', (code) =>
      code === 0
      ? resolve()
      : reject(new Error(`Command "${cmd}" failed with exit code ${code}.`))
    );
  });
}

async function runNative({version, tech}) {
  const sutDir = "sut-" + tech.toLowerCase();
  if (process.env.NOCOMP !== "true") {
    await mkdir(sutDir, {recursive: true});
    const codeDir = "../../code/c++/dst-native";
    await spawnCommand("g++", [
      "-std=c++17", "-O4",
      "-o", `${sutDir}/test_${version}`,
      "-I", "../../code/c++/src",
      // The current SUT:
      `${codeDir}/${version}.o`,
      // We use the C bindings even in c++/test.c++ because function
      // prepare_fft() creates an instance of the FFT class currently under
      // test:
      `${codeDir}/${version}_c_bindings.o`,
      // c++/test.c++ compares the SUT's result with the result from fft01.
      // So we have to include it (unless fft01 is the current SUT):
      ...tech === "C++" && version !== "fft01" ? [`${codeDir}/fft01.o`] : [],
      // The test driver:
      `c++/test.${tech.toLowerCase()}`,
    ]);
  }
  await spawnCommand(`${sutDir}/test_${version}`);
}

async function runNode({version, tech}) {
  await spawnCommand("node", [
    "js/test-c++.mjs",
    // an extra "../" to compensate the "js/" in the previous line:
    `../../../code/c++/dst-${tech.toLowerCase()}-node/${version}.js`,
  ]);
}

async function runTechForVersion({tech, version}) {
  console.log(`==== ${tech} ${version} ====`);
  switch (tech) {
    case "C"   :
    case "C++" : await runNative({version, tech}); break;
    case "JS"  :
    case "WASM": await runNode({version, tech}); break;
    default:
      // TODO such explanations should be written upon argument --help
      console.error(`
Environment variable TECH has value "${process.env.TECH}".
Comma-separated components of TECH should be taken from these values:
- C:    A test driver in C calls the SUT compiled to native code.
- C++:  A test driver in C++ calls the SUT compiled to native code.
- JS:   A test driver in JS calls the SUT compiled to JS.
- WASM: A test driver in JS calls the SUT compiled to WASM.
`);
      break;
  }
}

async function main() {
  try {
    const [, , ...versions] = process.argv;
    if (versions.length === 0) {
      versions.push(
        ...(await readdir("../../code/c++/dst-native"))
        .filter(name => name.match(/fft.+_c_bindings\.o/))
        .map(name => name.substring(0, name.length - 13)),
      );
    }

    const techs =
      (process.env.TECH ?? "C,C++,JS,WASM")
      .split(",").map(t => t.trim().toUpperCase().replace(/[-_]NODE/g, ""));

    for (const tech of techs) {
      for (const version of versions) {
        await runTechForVersion({tech, version});
      }
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
