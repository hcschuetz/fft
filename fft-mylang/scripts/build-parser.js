// const fs = require("fs");
// const path = require("path");
// const peggy = require("peggy");
import fs from "fs";
import peggy from "peggy";

try {
  const grammar = fs.readFileSync("mylang.peggy", "utf-8")

  const parser = peggy.generate(grammar, {
    output: 'source',
    format: 'es',
  });

  const outDir = "src/generated";
  const outFile = outDir + "/parser.js";
  fs.mkdirSync(outDir, {recursive: true});
  fs.writeFileSync(outFile, parser);
  console.log(`Parser written to ${outFile}`)
} catch (e) {
  let start = e.location?.start
  if (start) {
    console.error(`At ${start.line}:${start.column}:`)
  }
  console.error(e.message);
}