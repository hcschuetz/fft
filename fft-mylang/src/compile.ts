import B from "./tweaked-binaryen.js";
import { parse } from './generated/parser.js';
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { CompoundElement, Expression, Location, Position, Statement, Type } from "./AST";

const version = "fft60"
const filename = `mylang/${version}-mylang.c++`;
const mylangCode = readFileSync(filename, "utf-8");

function getAST(): CompoundElement[] | null {
  try {
    return parse(mylangCode, {}) as CompoundElement[];
  } catch (e: any) {
    if (e.format instanceof Function) {
      e.format([{source: filename, text: e.message}])
    }
    if (e.location?.start) {
      let {line, column} = e.location.start
      console.error(`${filename}:${line}:${column}:`)
      console.error(e.message);
      return null;
    } else {
      throw e;
    }
  }
}

// -----------------------------------------------------------------------------

type Expr = B.ExpressionRef;

/**
 * One of the values returned by `handleExpressionR` is conceptually a list
 * of local variables holding (components of) the expression's value.
 * The only thing one may do with such a variable is to get its value.
 * So `handleExpressionR` actually returns a list of `Result`s, each of
 * which returns a corresponding getter expression.
 * (Note that we cannot directly return the getter expression because multiple
 * usages of the same local variable need separate getter expressions.
 * Re-using an expression might confuse `binaryen`'s optimizer.)
 */
type Result = () => Expr;

type Local = {idx: number, binType: B.Type}
type VarInfo = {type: Type, locals: Local[]};
type VarEnv = Record<string, VarInfo>;

const typeToBinTypes = (type: Type): B.Type[] => (
  type === "complex"  ? [B.f64, B.f64] :
  type === "double"   ? [B.f64] :
  type === "int"      ? [B.i32] :
  is_po(type) ? [B.i32] :
  []
);

type BinTypeName = "i32" | "f64";

const binTypeName = (binType: B.Type): BinTypeName => (
  binType === B.i32 ? "i32" :
  binType === B.f64 ? "f64" :
  `### unsupported binType: ${binType} ###` as BinTypeName
);

const binTypeSize = (binType: B.Type): number | null => (
  binType === B.i32 ? 4 :
  binType === B.f64 ? 8 :
  null
);

const binTypeAlign = binTypeSize;

const size_of = (type: Type): number =>
  type === "complex" ? 16 :
  type === "double" ? 8 :
  type === "int" ? 4 :
  is_po(type) ? 4 :
  0;

const is_po = (type: Type): boolean => /_[po]$/.test(type);
const is_p = (type: Type): boolean => type.endsWith("_p");
const is_o = (type: Type): boolean => type.endsWith("_o");
const derefType = (type: Type): Type => type.substring(0, type.length - 2);

type Message = {text: String, location?: Location};

function compile(M: B.Module, funcName: string, parameters: string, ast: CompoundElement[], direction: number): Message[] {
  const messages: Message[] = [];
  let location: Location | undefined = undefined;
  function emitMessage(text: String) {
    messages.push({text, location});
  }

  const allLocals: B.Type[] = [];
  function makeLocal(binType: B.Type): Local {
    const idx = allLocals.length;
    allLocals.push(binType);
    return {idx, binType};
  }

  const getLocal = (local: Local): Expr => M.local.get(local.idx, local.binType);

  class Code {
    private expressions: Expr[] = [];

    emit(expr: Expr): void { this.expressions.push(expr)}
    setLocal(local: Local, value: Expr): void {
      this.emit(M.local.set(local.idx, value));
    }
    makeLocal(binType: B.Type, init: Expr): Local {
      const local = makeLocal(binType);
      this.setLocal(local, init);
      return local;
    }

    asBlock(): Expr { return M.block(null, this.expressions); }
  }
  
  const binOpToInstruction_i32: Record<string, (left: Expr, right: Expr) => Expr> = {
    "==": M.i32.eq,
    "!=": M.i32.ne,
    "<" : M.i32.lt_s,
    "<=": M.i32.le_s,
    ">" : M.i32.gt_s,
    ">=": M.i32.ge_s,
    "&": M.i32.and,
    "|": M.i32.or,
    "^": M.i32.xor,
    "+": M.i32.add,
    "-": M.i32.sub,
    "<<": M.i32.shl,
    ">>": M.i32.shr_s,
  }
  
  const binOpToInstruction_f64: Record<string, (left: Expr, right: Expr) => Expr> = {
    "==": M.f64.eq,
    "!=": M.f64.ne,
    "<" : M.f64.lt,
    "<=": M.f64.le,
    ">" : M.f64.gt,
    ">=": M.f64.ge,
    "+": M.f64.add,
    "-": M.f64.sub,
  }

  let loopIdx = 0;

  {
    const vars: Record<string, VarInfo> = {};
    for (const param of parameters.trim().split(",")) {
      const match = param.match(/^\s*([_a-z]+)\s*([_a-z]+)\s*$/);
      if (!match) {
        throw new Error("INTERNAL: parameter initializer: " + param);
      }
      const [, type, var_] = match;
      vars[var_] = {type, locals: typeToBinTypes(type).map(makeLocal)};
    }

    const paramTypes = B.createType(allLocals);
    const nParams = allLocals.length;

    const bodyCode = new Code();

    const directionBin = makeLocal(B.i32);
    vars["direction"] = {locals: [directionBin], type: "int"};
    bodyCode.setLocal(directionBin, M.i32.const(direction));

    handleStatement({kind: "CompoundStatement", elements: ast}, vars, bodyCode);
    M.addFunction(funcName, paramTypes, B.none, allLocals.slice(nParams), bodyCode.asBlock());

    return messages;
  }

  /** Compile an expression in an r-value position. */
  function handleExpressionR(expression: Expression, vars: VarEnv, code: Code): {type: Type, results: Result[]} {
    const retVal = (type: Type, exprs: Expr[]): {results: Result[], type: Type} => ({
      type,
      results: typeToBinTypes(type).map((binType, i) => {
        const local = code.makeLocal(binType, exprs[i]);
        return () => getLocal(local);
      }),
    });

    switch (expression.kind) {
      case "Variable": {
        const varName = expression.name
        const varInfo = vars[varName];
        if (!varInfo) {
          throw new Error("no such variable: " + varName)
        }
        const {type, locals} = varInfo;
        return {type, results: locals.map(local => () => getLocal(local))};
      }
      case "NumericLiteral": {
        return retVal("int", [M.i32.const(expression.value)]);
      }
      case "CallExpression": {
        const {callee, args} = expression;
        const xxx = args.map(arg => handleExpressionR(arg, vars, code));
        const argTypes  = xxx.map(({type}) => type);
        const argResults = xxx.map(({results}) => results);
        if (callee === "rot90") {
          if (argTypes.length !== 1 || argTypes[0] !== "complex") {
            emitMessage("rot90() expects one argument of type 'complex'.");
          }
          const [[arg_re, arg_im]] = argResults;
          return direction > 0
            ? retVal("complex", [          arg_im() , M.f64.neg(arg_re())])
            : retVal("complex", [M.f64.neg(arg_im()),           arg_re() ]);
        } else if (callee === "complex") {
          if (argTypes.length !== 2 || argTypes[0] !== "double" || argTypes[1] !== "double") {
            emitMessage("complex() expects two arguments of type double.");
          }
          const [[arg0], [arg1]] = argResults;
          return retVal("complex", [arg0(), arg1()]);
        } else if (is_o(callee)) {
          if (argTypes.length !== 1 || argTypes[0] !== "int") {
            emitMessage(callee + "() expects one argument of type int.");
          }
          return retVal(callee, [M.i32.mul(
            argResults[0][0](),
            M.i32.const(size_of(derefType(callee)))
          )]);
        } else {
          emitMessage("### unknown callee ###: " + callee)
          return retVal("### unknown callee ###", []);
        }
      }
      case "UnaryExpression": {
        const {operator, argument} = expression;
        const {type, results} = handleExpressionR(argument, vars, code);
        switch (operator) {
          case "+": {
            if (type !== "int" && !is_o(type)) {
              emitMessage(`Unary '+' not applicable to type ${type}`);
            }
            return {type, results};
          }
          case "-": {
            if (type !== "int" && !is_o(type)) {
              emitMessage(`Unary '-' not applicable to type ${type}`);
            }
            return retVal("int", [M.i32.sub(M.i32.const(0), results[0]())]);
          }
          // TODO: "!", "~", ...
          case "*": {
            if (!is_p(type)) {
              emitMessage(`Unary '*' not applicable to type ${type}`);
            }
            const referencedType = derefType(type);
            const binTypes = typeToBinTypes(referencedType)
            let offset = 0;
            const [ptr] = results;
            const exprs = binTypes.map(binType => {
              // TODO handle alignments properly for general structs
              // ... but the current code is good enough for `complex`
              const thisOffset = offset;
              const size = binTypeSize(binType);
              if (size == null) {
                emitMessage("size not known for " + binType);
              }
              offset += size ?? 0;
              return M[binTypeName(binType)].load(
                thisOffset,
                binTypeAlign(binType) ?? 0,
                ptr(),
              );
            });
            return retVal(referencedType, exprs);
          }
        }
        emitMessage("unsupported unary operator " + operator);
        return retVal("### UNKNOWN TYPE ###", []);
      }
      case "BinaryExpression": {
        const {left, operator, right} = expression;
        const  left_ = handleExpressionR(left , vars, code);
        const right_ = handleExpressionR(right, vars, code);
        switch (operator) {
          case "==":
          case "!=":
          case "<":
          case "<=":
          case ">":
          case ">=": {
            if (left_.type !== right_.type) {
              emitMessage(`cannot compare values of different type: ${left_.type} ${operator} ${right_.type}`);
            }
            const binTypes = typeToBinTypes(left_.type);
            if (binTypes.length !== 1) {
              emitMessage(`cannot compare values of non-scalar type ${left_.type} (${binTypes.map(binTypeName).join(", ")})`);
            }
            const binType = binTypes[0];
            let instr =
              binType === B.i32 ? binOpToInstruction_i32[operator] :
              binType === B.f64 ? binOpToInstruction_f64[operator] :
              (
                emitMessage(`comparison not supported for binary type ${binType}`),
                () => M.i32.const(0)
              );
              return retVal("int", [instr(left_.results[0](), right_.results[0]())]);
          }
          case "&":
          case "|":
          case "^": {
            if (left_.type !== right_.type) {
              emitMessage(`cannot apply bit operation to values of different type: ${left_.type} ${operator} ${right_.type}`);
            }
            const binTypes = typeToBinTypes(left_.type);
            if (binTypes.length !== 1) {
              emitMessage(`cannot apply bit operation to values of non-scalar type ${left_.type} (${binTypes.map(binTypeName).join(", ")})`);
            }
            const binType = binTypes[0];
            if (binType !== B.i32) {
              emitMessage(`bit operation not supported for binary type ${binType}`)
            }
            const instr = binOpToInstruction_i32[operator];
            return retVal(left_.type, [instr(left_.results[0](), right_.results[0]())]);
          }
          case "+":
          case "-": {
            if (
              (left_.type === "int" && right_.type === "int") ||
              (
                is_po(left_.type) && is_o(right_.type) &&
                derefType(left_.type) === derefType(right_.type)
              )
            ) {
              const instr = binOpToInstruction_i32[operator];
              return retVal(left_.type, [instr(left_.results[0](), right_.results[0]())]);
            } else if (left_.type === "double" && right_.type === "double") {
              const instr = binOpToInstruction_f64[operator];
              return retVal("double", [instr(left_.results[0](), right_.results[0]())]);
            } else if (left_.type === "complex" && right_.type === "complex") {
              const instr = binOpToInstruction_f64[operator];
              const [ left_re,  left_im] =  left_.results;
              const [right_re, right_im] = right_.results;
              return retVal("complex", [
                instr(left_re(), right_re()),
                instr(left_im(), right_im()),
              ])
            }
            emitMessage(`Unsupported: ${left_.type} ${operator} ${right_.type}`);
            return retVal("### unknown type ###", []);
          }
          case "<<":
          case ">>": {
            if (right_.type !== "int") {
              emitMessage(`Right arg to shift operator must be 'int', not '${right_.type}'`);
            }
            if (left_.type !== "int" && !is_o(left_.type)) {
              emitMessage(`Left arg to shift operator must be 'int' or offset type, not '${left_.type}'`);
            }
            const instr = binOpToInstruction_i32[operator];
            return retVal(left_.type, [instr(left_.results[0](), right_.results[0]())]);
          }
          case "*": {
            if (left_.type === "complex" && right_.type === "complex") {
              const [x_re, x_im] =  left_.results;
              const [y_re, y_im] = right_.results;
              return retVal("complex", [
                M.f64.sub(M.f64.mul(x_re(), y_re()), M.f64.mul(x_im(), y_im())),
                M.f64.add(M.f64.mul(x_re(), y_im()), M.f64.mul(x_im(), y_re())),
              ]);
            } else if (
              (left_.type === "int" && right_.type === "int") ||
              (is_o(left_.type)     && right_.type === "int") ||
              (left_.type === "int" && is_o(right_.type)    )
            ) {
              return retVal(left_.type === "int" ? right_.type : left_.type, [
                M.i32.mul(left_.results[0](), right_.results[0]())
              ]);
            }
            break;
          }
        }
        emitMessage(`cannot apply binop to operands: ${left_.type} ${operator} ${right_.type}`);
        return retVal("### unknown type ###", []);
      }
      default: {
        emitMessage(`unsupported expression: ${expression.kind}`);
        return retVal("### unknown type ###", []);
      }
    }
  }

  function handleStatement(statement: Statement, vars: VarEnv, code: Code): void {
    const oldLocation = location;
    try {
      location = statement.location;
      // TODO add location to source map
      // location ? [`LOCATION: ${filename}:${location.start.line}:${location.start.column}`] : [],
      return handleStatement_noLoc(statement, vars, code);
    } finally {
      location = oldLocation
    }
  }
  function handleStatement_noLoc(statement: Statement, vars: VarEnv, code: Code): void {
    switch (statement.kind) {
      case "EmptyStatement": {
        return;
      }
      case "IncrementStatement": {
        const {var_} = statement;
        const {type, locals} = vars[var_];
        const step =
          type === "int" ? 1 :
          is_po(type) ? size_of(derefType(type)) :
          (emitMessage(`'++' operation not supported for variable ${var_} of type ${type}`), 1);
        const local = locals[0];
        code.setLocal(local, M.i32.add(
          getLocal(local),
          M.i32.const(step),
        ));
        return;
      }
      case "AssignmentStatement": {
        const {deref, var_, operator, value} = statement;
        const {type: valueType, results} = handleExpressionR(value, vars, code);
        const {type: varType, locals} = vars[var_];
        if (deref) {
          if (!is_p(varType)) {
            emitMessage(`pointer applied to non-pointer variable on left-hand side of assignment (${varType} ${var_})`);
          }
          if (operator !== "=") {
            emitMessage("only '=' assignments supported with pointer on left-hand side");
          }
          const leftType = derefType(varType);
          if (valueType != leftType) {
            emitMessage(`assignment types do not match (${leftType}, ${valueType})`);
          }
          if (leftType !== "complex") {
            emitMessage(`assignments with pointer on left-hand side only supported for type 'complex'`);
          }
          const local = locals[0];
          code.emit(M.f64.store(0, 8, getLocal(local), results[0]()));
          code.emit(M.f64.store(8, 8, getLocal(local), results[1]()));
          return;
        } else if (operator === "=") {
          if (valueType != varType) {
            emitMessage(`assignment types do not match (${varType}, ${valueType})`);
          }
          locals.forEach((local, i) => code.setLocal(local, results[i]()));
          return;
        } else if (operator === "+=") {
          if (!is_po(varType)) {
            emitMessage(`left-hand side of '+=' must (for now) be pointer or offset`);
          }
          if (!is_o(valueType)) {
            emitMessage(`right-hand side of '+=' must (for now) be offset`);
          }
          const referencedType = derefType(varType)
          if (derefType(valueType) !== referencedType) {
            emitMessage(`type mismatch in '+=' statement`);
          }
          const local = locals[0];
          code.setLocal(local, M[binTypeName(local.binType)].add(
            getLocal(local),
            results[0](),
          ));
          return;
        }
        emitMessage(`unsupported assignment variant`);
        return;
      }
      case "ExpressionStatement": {
        handleExpressionR(statement.expression, vars, code)
        return;
      }
      case "CompoundStatement": {
        const innerVars: VarEnv = Object.setPrototypeOf({}, vars);
        for (const element of statement.elements) {
          if (element.kind === "VarDecl") {
            const oldLocation = location;
            try {
              location = element.location;
              const {var_, type, init} = element;
              const {type: initType, results} =
                handleExpressionR(init, innerVars, code);
              if (initType !== type) { // No automatic type casts for now
                emitMessage(`type mismatch in initializer: ${type} vs. ${initType}`);
              }
              const locals = typeToBinTypes(type).map((binType, i) =>
                code.makeLocal(binType, results[i]())
              );
              innerVars[var_] = {type, locals};
            } finally {
              location = oldLocation;
            }
          } else {
            handleStatement(element, innerVars, code);
          }
        }
        return;
      }
      case "IfStatement": {
        const {test, consequent, alternate} = statement;

        const test_ = handleExpressionR(test, vars, code);
        if (test_.type !== "int") {
          emitMessage(`non-int if condition`);
        }

        const consequentCode = new Code();
        handleStatement(consequent, vars, consequentCode);

        const alternateCode = new Code();
        if (alternate) {
          handleStatement(alternate, vars, alternateCode);
        }

        code.emit(
          M.if(
            test_.results[0](),
            consequentCode.asBlock(),
            alternateCode.asBlock(),
          ),
        );
        return;
      }
      case "ForStatement": {
        emitMessage(`'for' loop unimplemented`);
        return;
      }
      case "WhileStatement": {
        const {test, body} = statement;

        const loopLabel = "while_loop_" + loopIdx++;

        const loopCode = new Code();
        const test_ = handleExpressionR(test, vars, loopCode);
        if (test_.type !== "int") {
          emitMessage(`Test in 'while' loop must be of type 'int'`)
        }

        const bodyCode = new Code();
        handleStatement(body, vars, bodyCode);
        bodyCode.emit(M.br(loopLabel));

        loopCode.emit(
          M.if(
            test_.results[0](),
            bodyCode.asBlock(),
          ),
        );

        code.emit(M.loop(loopLabel, loopCode.asBlock()));
        return;
      }
      case "ReturnStatement": {
        code.emit(M.return());
        return;
      }
      default: throw new Error("Unexpected statement kind: " + (statement as any).kind);
    }
  }
}

const positionText = (pos: Position): string =>
  `${filename}:${pos.line}:${pos.column}`;

async function main() {
  const ast = getAST();
  if (!ast) {
    console.error("parsing failed");
    process.exit(1);
  }
  const M = new B.Module();
  M.setMemory(0, 1 << 16); // TODO what is a reasonable maximum?
  M.addMemoryImport("0", "env", "memory");

  const parameters = `
    int n,
    complex_p_p shuffled,
    double_p cosines,
    complex_p output
  `;
  const messages = [
    ...compile(M, "fft", parameters, ast, 1),
    ...compile(M, "ifft", parameters, ast, -1),
  ];

  for (const {text, location} of messages) {
    if (location) {
      const {start, end} = location;
      console.error(`${positionText(start)} to ${positionText(end)}: ${text}`);
    } else {
      console.error(text);
    }
  }
  M.addFunctionExport("fft", "fft");
  M.addFunctionExport("ifft", "ifft");
  // console.log(M.emitText());
  const valid = M.validate();
  if (!valid) {
    console.error("Validation failed.");
    process.exit(1);
  }
  M.optimize();
  // console.log("optimized:");
  // console.log(M.emitText());
  const binary = M.emitBinary();
  const wasmCode = Buffer.from(binary);
  mkdirSync("dst-wasm", {recursive: true});
  writeFileSync("dst-wasm/" + version + "-wasm.js", `
const ${version}_wasm_base64 = ${"`"}
${wasmCode.toString("base64").match(/.{1,72}/g)!.join("\n")}
${"`"};

export default ${version}_wasm_base64;
// module.exports = ${version}_wasm_base64;
`);
}

main();
