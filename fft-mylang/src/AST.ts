
export type Optional<T> = T | null | undefined;

export type Position = {
  offset: number,
  line: number,
  column: number,
};
export type Location = {
  start: Position,
  end: Position,
};

export type Type = string;

export type VariableExpression = {kind: "Variable", name: string};

export type Expression =
  VariableExpression
| {kind: "NumericLiteral", value: number}
| {kind: "CallExpression", callee: string, args: Expression[]}
| {kind: "BinaryExpression", left: Expression, operator: string, right: Expression}
| {kind: "UnaryExpression", operator: string, argument: Expression}
| {kind: "ConditionalExpression", test: Expression, consequent: Expression, alternate: Expression}
;

export type VarDecl =
  {kind: "VarDecl", var_: string, type: Type, init: Expression};
export type ExpressionStatement =
  {kind: "ExpressionStatement", expression: Expression};
export type EmptyStatement =
  {kind: "EmptyStatement"};
export type CompoundStatement =
  {kind: "CompoundStatement", elements: CompoundElement[]};
export type IfStatement =
  {kind: "IfStatement", test: Expression, consequent: Statement, alternate: Optional<Statement>};
export type ForStatement =
  {kind: "ForStatement", init: (EmptyStatement|ExpressionStatement|VarDecl), test: Expression, update: Optional<Expression>, body: Statement};
export type WhileStatement =
  {kind: "WhileStatement", test: Expression, body: Statement };
export type IncrementStatement =
  {kind: "IncrementStatement", var_: string};
export type AssignmentStatement =
  {kind: "AssignmentStatement", deref: boolean, var_: string, operator: string, value: Expression}
export type ReturnStatement =
  {kind: "ReturnStatement"}

export type Statement_noLoc =
  EmptyStatement
| ExpressionStatement
| CompoundStatement
| IfStatement
| ForStatement
| WhileStatement
| IncrementStatement
| AssignmentStatement
| ReturnStatement
;

export type Statement = Statement_noLoc & { location?: Location }

export type CompoundElement =
  VarDecl & { location?: Location}
| Statement
;
