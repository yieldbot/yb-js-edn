%lex

int  "-"?([0-9]|[1-9][0-9]+)
frac "."[0-9]+

%%

\s+                                            /* skip whitespace */
\,                                             /* commas are whitespace */
\;[^\n]+                                       /* skip comment */

\#[_]                                          return 'DISCARD';

\\newline                                      return 'NEWLINE';
\\return                                       return 'RETURN';
\\space                                        return 'SPACE';
\\tab                                          return 'TAB';
\\[a-z]\b                                      return 'CHAR'

{int}{frac}\b                                  return 'FLOAT';
{int}\b                                        return 'INTEGER';

\"(?:'\\'[\\"bfnrt/]|'\\u'[a-fA-F0-9]{4}|[^\\\0-\x09\x0a-\x1f"])*\" return 'STRING'
/* \"([^\"\\]|\\.)*\"                          return 'STRING'; */

true                                           return 'TRUE';
false                                          return 'FALSE';
nil                                            return 'NIL';
<<EOF>>                                        return 'EOF';

\(                                             return '(';
\)                                             return ')';
\#\{                                           return '#{';
\{                                             return '{';
\}                                             return '}';
\[                                             return '[';
\]                                             return ']';

\#[a-zA-Z0-9\/]+                                                       return 'TAG';
\:[a-zA-Z0-9\/\.\*\+\!\:\-\_\?\$\=\#]+                                 return 'KEYWORD';
[a-zA-Z\.\*\+\!\-\_\?\$\%\&\=\/][a-zA-Z0-9\#\.\*\+\!\-\_\?\$\%\&\=\/]* return 'SYMBOL';


/lex

%start edn

%%

edn
    : EdnValue EOF { return $$ = $1; }
    ;

EdnValue
    : EdnNilLiteral
    | EdnBooleanLiteral
    | EdnString
    | EdnCharacter
    | EdnSymbol
    | EdnKeyword
    | EdnInteger
    | EdnFloat
    | EdnList
    | EdnVector
    | EdnMap
    | EdnSet
    | EdnTag
    ;

EdnValueList
    : DISCARD EdnValue { $$ = []; }
    | EdnValue { $$ = [$1]; }
    | EdnValueList DISCARD EdnValue { $$ = $1 }
    | EdnValueList EdnValue { $$ = $1; $1.push($2); }
    ;

EdnNilLiteral
    : NIL { $$ = null; }
    ;

EdnBooleanLiteral
    : TRUE  { $$ = true; }
    | FALSE { $$ = false; }
    ;

EdnString
    : STRING
        { // replace escaped characters with actual character
          $$ = yytext.substr(1,yyleng-2)
                 .replace(/\\(\\|")/g, "$"+"1")
                 .replace(/\\n/g,'\n')
                 .replace(/\\r/g,'\r')
                 .replace(/\\t/g,'\t')
                 .replace(/\\v/g,'\v')
                 .replace(/\\f/g,'\f')
                 .replace(/\\b/g,'\b');
        }
    ;

EdnCharacter
    : NEWLINE { $$ = yy.Character("\n"); }
    | RETURN  { $$ = yy.Character("\r"); }
    | SPACE   { $$ = yy.Character(" "); }
    | TAB     { $$ = yy.Character("\t"); }
    | CHAR    { $$ = yy.Character(yytext[1]); }
    ;

EdnSymbol
    : SYMBOL { $$ = yy.Symbol(yytext); }
    ;

EdnKeyword
    : KEYWORD { $$ = yy.Keyword(yytext.slice(1)); }
    ;

EdnInteger
    : INTEGER { $$ = parseInt(yytext); }
    ;

EdnFloat
    : FLOAT { $$ = parseFloat(yytext); }
    ;

EdnList
    : '(' ')'              { $$ = yy.List([]); }
    | '(' EdnValueList ')' { $$ = yy.List($2); }
    ;

EdnVector
    : '[' ']'              { $$ = yy.Vector([]); }
    | '[' EdnValueList ']' { $$ = yy.Vector($2); }
    ;

EdnMap
    : '{' '}'              { $$ = yy.Map([]); }
    | '{' EdnValueList '}' { $$ = yy.Map($2); }
    ;

EdnSet
    : '#{' '}'              { $$ = yy.Set([]); }
    | '#{' EdnValueList '}' { $$ = yy.Set($2); }
    ;

EdnTag
    : TAG EdnValue { $$ = yy.Tag($1.substr(1), $2); }
    ;
