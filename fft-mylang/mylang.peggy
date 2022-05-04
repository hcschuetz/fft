// Initially stolen from
// https://github.com/peggyjs/peggy/blob/main/examples/javascript.pegjs
// and simplified and adapted to my needs.

{{
  const buildBinaryExpression = (head, tail) => tail.reduce(
    (left, [, operator,, right]) =>
      ({kind: "BinaryExpression", left, operator, right}),
    head
  );
}}

// -----------------------------------------------------------------------------

Start
  = __ @(@CompoundElement __)*

// -----------------------------------------------------------------------------
// Lexer

SourceCharacter
  = .

WhiteSpace "whitespace"
  = "\u0020"
  / "\t"
  / "\v"
  / "\f"
  / " "
  / "\u00A0"
  / "\uFEFF"

LineTerminator
  = [\n\r\u2028\u2029]

LineTerminatorSequence "end of line"
  = "\n"
  / "\r\n"
  / "\r"

Comment "comment"
  = "/*" (!"*/" SourceCharacter)* "*/"
  / "//" (!LineTerminator SourceCharacter)*

__
  = (WhiteSpace / LineTerminatorSequence / Comment)*

Identifier
  = !ReservedWord @IdentifierName

IdentifierName "identifier"
  = head:IdentifierStart tail:IdentifierPart* { return head + tail.join(""); }

IdentifierStart
  = [$_A-Za-z]

IdentifierPart
  = IdentifierStart
  / [0-9]

IfToken         = @"if"         !IdentifierPart
ElseToken       = @"else"       !IdentifierPart
ForToken        = @"for"        !IdentifierPart
WhileToken      = @"while"      !IdentifierPart
ReturnToken     = @"return"     !IdentifierPart

ReservedWord
  = Keyword

Keyword
  = IfToken
  / ElseToken
  / ForToken
  / WhileToken
  / ReturnToken


Literal
  = ("0" / [1-9][0-9]*) {
      return { kind: "NumericLiteral", value: Number.parseInt(text()) };
    }

// -----------------------------------------------------------------------------
// Expressions

PrimaryExpression
  = name:Identifier { return {kind: "Variable", name}}
  / Literal
  / "(" __ @Expression __ ")"

CallExpression
  = callee:Identifier __ "(" __ args:(@ArgumentList __)? ")" {
      return { kind: "CallExpression", callee, args: args ?? [] };
    }
  / PrimaryExpression

ArgumentList
  = head:AssignmentExpression tail:(__ "," __ @AssignmentExpression)* {
      return [head, ...tail];
    }

PostfixExpression // not supported for now
  = CallExpression

PostfixOperator
  = "++"
  / "--"

UnaryExpression
  = PostfixExpression
  / operator:UnaryOperator __ argument:UnaryExpression {
      return {kind: "UnaryExpression", operator, argument};
    }

UnaryOperator
  = $("+" ![+=])
  / $("-" ![-=])
  / "~"
  / "!"
  / "*"
  // 

MultiplicativeExpression
  = head:UnaryExpression
    tail:(__ MultiplicativeOperator __ UnaryExpression)*
    { return buildBinaryExpression(head, tail); }

MultiplicativeOperator
  = $("*" !"=")
  / $("/" !"=")
  / $("%" !"=")

AdditiveExpression
  = head:MultiplicativeExpression
    tail:(__ AdditiveOperator __ MultiplicativeExpression)*
    { return buildBinaryExpression(head, tail); }

AdditiveOperator
  = $("+" ![+=])
  / $("-" ![-=])

ShiftExpression
  = head:AdditiveExpression
    tail:(__ ShiftOperator __ AdditiveExpression)*
    { return buildBinaryExpression(head, tail); }

ShiftOperator
  = $("<<"  !"=")
  / $(">>"  !"=")

RelationalExpression
  = head:ShiftExpression
    tail:(__ RelationalOperator __ ShiftExpression)*
    { return buildBinaryExpression(head, tail); }

RelationalOperator
  = "<="
  / ">="
  / $("<" !"<")
  / $(">" !">")

EqualityExpression
  = head:RelationalExpression
    tail:(__ EqualityOperator __ RelationalExpression)*
    { return buildBinaryExpression(head, tail); }

EqualityOperator
  = "=="
  / "!="

BitwiseANDExpression
  = head:EqualityExpression
    tail:(__ BitwiseANDOperator __ EqualityExpression)*
    { return buildBinaryExpression(head, tail); }

BitwiseANDOperator
  = $("&" ![&=])

BitwiseXORExpression
  = head:BitwiseANDExpression
    tail:(__ BitwiseXOROperator __ BitwiseANDExpression)*
    { return buildBinaryExpression(head, tail); }

BitwiseXOROperator
  = $("^" !"=")

BitwiseORExpression
  = head:BitwiseXORExpression
    tail:(__ BitwiseOROperator __ BitwiseXORExpression)*
    { return buildBinaryExpression(head, tail); }

BitwiseOROperator
  = $("|" ![|=])

LogicalANDExpression
  = head:BitwiseORExpression
    tail:(__ LogicalANDOperator __ BitwiseORExpression)*
    { return buildBinaryExpression(head, tail); }

LogicalANDOperator
  = "&&"

LogicalORExpression
  = head:LogicalANDExpression
    tail:(__ LogicalOROperator __ LogicalANDExpression)*
    { return buildBinaryExpression(head, tail); }

LogicalOROperator
  = "||"

ConditionalExpression
  = test:LogicalORExpression __
    "?" __ consequent:AssignmentExpression __
    ":" __ alternate:AssignmentExpression
    { return {kind: "ConditionalExpression", test, consequent, alternate}; }
  / LogicalORExpression

// We only support assignment statements
AssignmentExpression
  = ConditionalExpression

AssignmentOperator
  = $("=" !"=")
  / "*="
  / "/="
  / "%="
  / "+="
  / "-="
  / "<<="
  / ">>="
  / ">>>="
  / "&="
  / "^="
  / "|="

// no sequence expressions
Expression
  = AssignmentExpression

// -----------------------------------------------------------------------------

Statement
  = ExpressionStatement
  / CompoundStatement
  / IfStatement
  / WhileStatement
  / ForStatement
  / EmptyStatement
  / IncrementStatement
  / AssignmentStatement
  / ReturnStatement

VarDeclLoc
  = x:VarDecl   {return {...x, location: location()}}
StatementLoc
  = x:Statement {return {...x, location: location()}}

CompoundElement
  = VarDeclLoc
  / StatementLoc

Type
  = Identifier

VarDecl
  = type:Type __ var_:Identifier __ "="!"=" __ init:AssignmentExpression __ ";"{
      return {kind: "VarDecl", var_, type, init};
    }

ExpressionStatement
  = expression:Expression __ ";" {
    return {kind: "ExpressionStatement", expression};
  }

CompoundStatement
  = elements:( "{" __ @( @CompoundElement __ )* "}" ) {
      return {kind: "CompoundStatement", elements};
    }

IfStatement
  = IfToken __ "(" __ test:Expression __ ")" __ consequent:StatementLoc __
    alternate:(ElseToken __ @StatementLoc)?
    {
      return {kind: "IfStatement", test, consequent, alternate};
    }

WhileStatement
  = WhileToken __ "(" __ test:Expression __ ")" __ body:StatementLoc
    { return { kind: "WhileStatement", test, body }; }

ForStatement
  = ForToken __
    "(" __
    init:(@(ExpressionStatement / VarDecl / EmptyStatement) __)?
    test:(@Expression __)? ";" __
    update:(@Expression __)?
    ")" __
    body:StatementLoc
    {
      return {kind: "ForStatement", init, test, update, body};
    }

EmptyStatement
  = ";" {return {kind: "EmptyStatement"};}

IncrementStatement
  = "++" __ var_:Identifier __ ";" {
      return {kind: "IncrementStatement", var_};
    }

AssignmentStatement
  = deref:("*" __)? var_:Identifier __ operator:AssignmentOperator __ value:AssignmentExpression __ ";"{
      return {kind: "AssignmentStatement", deref: Boolean(deref), var_, operator, value};
    }

ReturnStatement
  = ReturnToken { return { kind: "ReturnStatement" }; }