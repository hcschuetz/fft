import { spawn } from "child_process";

export async function spawnCommand(cmd, args = []) {
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
