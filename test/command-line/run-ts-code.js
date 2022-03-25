#!/usr/bin/env node
import { spawn } from "child_process";
import { mkdir, readdir, rm } from "fs/promises";

const onWindows = process.platform.startsWith("win");

class CommandError extends Error {
  constructor(cmd, code) {
    super(`Command "${cmd}" failed with exit code ${code}.`);
    this.code = code;
  }
}

async function spawnCommand(cmd, args) {
  // console.log("spawn:", [cmd, ...args].join(" "));
  await new Promise((resolve, reject) => {
    const child = spawn(cmd, args);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.on('close', (code) =>
      code === 0 ? resolve() : reject(new CommandError(cmd, code))
    );
  });
}

async function run({version}) {
  await spawnCommand("node", [
    "dst/test-ts.js",
    // an extra "../" to compensate the "js/" in the previous line:
    `../dst/sut/fft/${version}.js`,
  ]);
}

async function rimraf(path) {
  console.log(`Remove ${path}...`);
  await rm(path, {recursive: true, force:true});
  console.log(`Remove ${path}...done`);
}

const toWin = path => path.replace(/\//g, "\\");

async function copyDeep(src, dest) {
  console.log(`Copy ${src} to ${dest}...`);
  if (onWindows) {
    try {
      await spawnCommand("robocopy", [toWin(src), toWin(dest), "/e"]);
    } catch(e) {
      // We actually expect a return code 1 from robocopy,
      // which does not indicate an error.
      if (!(e instanceof CommandError && e.code === 1)) {
        throw e;
      }
    }
  } else {
    await spawnCommand("cp", ["-a", src, dest]);
  }
  console.log(`Copy ${src} to ${dest}...done`);
}

async function main() {
  try {
    await rimraf("src/sut");
    await copyDeep("../../code/ts/dst", "src/sut");

    await rimraf("dst/sut");
    await copyDeep("../../code/ts/dst", "dst/sut");

    // TODO (figure out how to) avoid recompilation if nothing has changed
    console.log("Running tsc...");
    const tscArgs = ["--build", "--verbose"];
    if (onWindows) {
      await spawnCommand("cmd", ["/c", "node_modules\\.bin\\tsc.cmd", ...tscArgs]);
    } else {
      await spawnCommand("node_modules/.bin/tsc", tscArgs);
    }
    console.log("Running tsc...done");

    console.log("Determining versions to test...");
    const [, , ...versions] = process.argv;
    if (versions.length === 0) {
      versions.push(
        ...(await readdir("src/sut/fft"))
        .filter(name => name.match(/fft.+\.js$/))
        .map(name => name.substring(0, name.length - 3)),
      );
    }
    console.log("Determining versions to test...done: ", ...versions);

    for (const version of versions) {
      console.log(`Testing ${version}...`);
      await run({version});
      console.log(`Testing ${version}...done`);
    }
    console.log("Tests completed.")
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
