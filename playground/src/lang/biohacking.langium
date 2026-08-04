grammar Biohacking

// ---------------------------------------------------------------------------
// The Biohacking DSL is self-describing.
//
// This grammar defines only STRUCTURE — how to declare a type, how to declare
// an instance, how to write a value. It knows nothing about substances, doses
// or protocols. Those live in builtin/core.bio, expressed in this same syntax,
// which is what lets a user add `type training { sets: Number }` to their own
// workspace without touching the language.
//
// core.bio is loaded into every workspace by BiohackingWorkspaceManager (see
// builtin-library.ts) and is always in scope, unimported and unshadowable. The
// standard library under std/ is the opposite: an ordinary catalog you import
// by name and may override.
//
// Source compatibility is deliberate and load-bearing:
//     substance "Caffeine" { half_life: 5 h }
// parses identically whether `substance` is a keyword (as it was) or a
// TypeDecl reference (as it now is) — both are ID STRING '{'. Every file in
// std/ therefore survives the migration unedited, which is asserted by
// test/std-library-parses.test.ts.
//
// RESERVED WORDS, now the complete list:
//     import  type  is  extends  oneof  Vocab  Ref  use
// Everything else — including `substance`, `dose`, `half_life`, `status` — is
// an ordinary identifier. Before this change roughly thirty property names
// were reserved keywords and could not be used as type or member names.
// ---------------------------------------------------------------------------

entry Model:
    imports+=Import*
    (declarations+=Declaration)*;

Import:
    'import' path=STRING;

Declaration:
    TypeDecl | EntityDecl;

// ---------------------------------------------------------------------------
// Metamodel — type declarations
// ---------------------------------------------------------------------------

TypeDecl:
    'type' name=ID
    ('extends' superType=[TypeDecl:ID])?
    ('is' traits+=ID (',' traits+=ID)*)?
    (annotations+=Annotation)*
    '{'
        (members+=MemberDecl)*
    '}';

MemberDecl:
    name=ID (optional?='?')? ':' type=TypeRef ('=' default=Value)? (annotations+=Annotation)*;

// Presentation and editor metadata, e.g. @icon("dumbbell") @widget(slider, 1, 10).
// Deliberately untyped at the grammar level: the set of known annotations is
// validated in the type checker so adding one never requires a grammar change.
Annotation:
    '@' name=ID ('(' (args+=AnnotationArg (',' args+=AnnotationArg)*)? ')')?;

AnnotationArg:
    stringValue=STRING | identValue=ID | numberValue=NUMBER;

TypeRef:
    ListTypeRef | EnumTypeRef | VocabTypeRef | RefTypeRef | NamedTypeRef;

ListTypeRef:
    '[' element=TypeRef ']';

// A closed set of allowed identifiers, e.g. oneof(active, paused, completed).
// Replaces the hardcoded TIME_OF_DAY_VOCAB / PROTOCOL_STATUS_VOCAB checks.
EnumTypeRef:
    'oneof' '(' values+=ID (',' values+=ID)* ')';

// An OPEN vocabulary drawn from a named domain, e.g. Vocab<interaction_term>.
// Values stay free strings — conflicts/targets legitimately mix substances,
// drug classes and risk states, so a closed reference type would be wrong.
// The domain name drives completion and did-you-mean hints.
VocabTypeRef:
    'Vocab' '<' domain=ID '>';

// A resolved reference to another entity. Per the identity rule, this matches
// instances of the target type AND its subtypes.
RefTypeRef:
    'Ref' '<' target=[TypeDecl:ID] '>';

// Primitives (Number, String, Text, Bool, Ident, Measurement) and struct types
// alike. Left as a plain ID rather than a cross-reference so the type checker
// can resolve primitives, which have no declaration, and give a better error
// than an unresolved-reference marker.
NamedTypeRef:
    typeName=ID;

// ---------------------------------------------------------------------------
// Entity instances
//
// Alternatives inside a body are distinguishable at two tokens:
//   ID ':'     -> ScalarAssignment    (half_life: 5 h)
//   ID '{'     -> StructAssignment    (dose { min: 5 mg })
//   ID STRING  -> EntityDecl          (phase "Loading" { ... })
//   'use'      -> Use                 (use substance "Caffeine")
// ---------------------------------------------------------------------------

EntityDecl:
    type=[TypeDecl:ID] name=STRING
    ('extends' superType=[EntityDecl:STRING])?
    '{'
        (assignments+=Assignment)*
    '}';

Assignment:
    ScalarAssignment | StructAssignment | EntityDecl | Use;

ScalarAssignment:
    name=ID ':' value=Value (annotations+=Annotation)*;

// A struct-typed member written as a block, e.g. `dose { min: 5 mg, max: 10 mg }`.
// Commas between fields are optional so both existing styles keep parsing.
StructAssignment:
    name=ID '{' (fields+=Assignment (','? fields+=Assignment)*)? '}' (annotations+=Annotation)*;

// Reference-with-overrides. Kept as host grammar rather than modelled as a
// member type: the override block is typed against the REFERENCED entity, which
// no clean member typing expresses. Generic over the target type, so a user's
// own types get it for free.
Use:
    'use' type=[TypeDecl:ID] target=[EntityDecl:STRING]
    ('{' (overrides+=Assignment)* '}')?;

Value:
    Measurement | ListValue | TextValue | IdentValue | NumberValue;

ListValue:
    '[' (items+=Value (',' items+=Value)*)? ']';

TextValue:
    value=(STRING | MULTISTRING);

IdentValue:
    value=ID;

// Reachable only for a bare number — a number followed by a unit on the same
// line lexes as MEASURED_NUMBER and takes the Measurement branch instead.
NumberValue:
    value=NUMBER;

// ---------------------------------------------------------------------------
// Measurement with decimal support
// ---------------------------------------------------------------------------

Measurement:
    amount=MEASURED_NUMBER unit=Unit;

// eg ng/mL, mg, mg/dL, mg/kg, IU/day
Unit:
    unit+=ID ('/' unit+=ID)*;

// ---------------------------------------------------------------------------
// Terminals
// ---------------------------------------------------------------------------

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;

// A number that is directly followed by a unit ON THE SAME LINE.
//
// WHY THE LOOKAHEAD: whitespace is hidden, so once bare numbers became legal
// values (generic Assignment), the parser could not tell `sets: 5` followed on
// the NEXT line by `reps: 3` from the single measurement `5 reps` — both are
// NUMBER then ID. Deciding this in the parser is impossible at any lookahead;
// deciding it in the lexer is trivial, because `[ \t]` cannot cross a newline.
//
// Must stay declared BEFORE NUMBER: Langium preserves declaration order as
// lexer priority, and a bare `5` has to fall through to NUMBER.
terminal MEASURED_NUMBER returns number: /[0-9]+(\.[0-9]+)?(?=[ \t]*[a-zA-Z])/;
terminal NUMBER returns number: /[0-9]+(\.[0-9]+)?/;
terminal MULTISTRING: /'''[\s\S]*?'''/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
