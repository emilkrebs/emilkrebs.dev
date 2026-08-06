var Cn=Object.defineProperty;var Vn=(n,t,e)=>t in n?Cn(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var h=(n,t,e)=>Vn(n,typeof t!="symbol"?t+"":t,e);import{DefaultCommentProvider as fr,inject as gn}from"langium";import{createDefaultModule as yr,createDefaultSharedModule as gr}from"langium/lsp";import{createTypirLangiumServices as hr,initializeLangiumTypirServices as $r}from"typir-langium";import*as vt from"langium";var Yr={WS:/\s+/,ID:/[_a-zA-Z][\w_]*/,MEASURED_NUMBER:/[0-9]+(\.[0-9]+)?(?=[ \t]*[a-zA-Z])/,NUMBER:/[0-9]+(\.[0-9]+)?/,MULTISTRING:/'''[\s\S]*?'''/,STRING:/"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/,ML_COMMENT:/\/\*[\s\S]*?\*\//,SL_COMMENT:/\/\/[^\n\r]*/},Re={$type:"Annotation",args:"args",name:"name"};function Tt(n){return f.isInstance(n,Re.$type)}var Y={$type:"AnnotationArg",identValue:"identValue",numberValue:"numberValue",stringValue:"stringValue"};function Hr(n){return f.isInstance(n,Y.$type)}var W={$type:"Assignment"};function Jr(n){return f.isInstance(n,W.$type)}var ve={$type:"Declaration"};function Xr(n){return f.isInstance(n,ve.$type)}var N={$type:"EntityDecl",assignments:"assignments",name:"name",superType:"superType",type:"type"};function y(n){return f.isInstance(n,N.$type)}var ze={$type:"EnumTypeRef",values:"values"};function xt(n){return f.isInstance(n,ze.$type)}var qe={$type:"IdentValue",value:"value"};function $(n){return f.isInstance(n,qe.$type)}var Ze={$type:"Import",path:"path"};function It(n){return f.isInstance(n,Ze.$type)}var Ye={$type:"ListTypeRef",element:"element"};function Qr(n){return f.isInstance(n,Ye.$type)}var He={$type:"ListValue",items:"items"};function ee(n){return f.isInstance(n,He.$type)}var Te={$type:"Measurement",amount:"amount",unit:"unit"};function v(n){return f.isInstance(n,Te.$type)}var P={$type:"MemberDecl",annotations:"annotations",default:"default",name:"name",optional:"optional",type:"type"};function kt(n){return f.isInstance(n,P.$type)}var xe={$type:"Model",declarations:"declarations",imports:"imports"};function E(n){return f.isInstance(n,xe.$type)}var Je={$type:"NamedTypeRef",typeName:"typeName"};function te(n){return f.isInstance(n,Je.$type)}var Xe={$type:"NumberValue",value:"value"};function ne(n){return f.isInstance(n,Xe.$type)}var Qe={$type:"RefTypeRef",target:"target"};function At(n){return f.isInstance(n,Qe.$type)}var H={$type:"ScalarAssignment",annotations:"annotations",name:"name",value:"value"};function d(n){return f.isInstance(n,H.$type)}var J={$type:"StructAssignment",annotations:"annotations",fields:"fields",name:"name"};function b(n){return f.isInstance(n,J.$type)}var et={$type:"TextValue",value:"value"};function I(n){return f.isInstance(n,et.$type)}var x={$type:"TypeDecl",annotations:"annotations",members:"members",name:"name",superType:"superType",traits:"traits"};function M(n){return f.isInstance(n,x.$type)}var B={$type:"TypeRef"};function ei(n){return f.isInstance(n,B.$type)}var tt={$type:"Unit",unit:"unit"};function St(n){return f.isInstance(n,tt.$type)}var X={$type:"Use",overrides:"overrides",target:"target",type:"type"};function R(n){return f.isInstance(n,X.$type)}var _={$type:"Value"};function ti(n){return f.isInstance(n,_.$type)}var nt={$type:"VocabTypeRef",domain:"domain"};function Dt(n){return f.isInstance(n,nt.$type)}var Q=class extends vt.AbstractAstReflection{constructor(){super(...arguments);h(this,"types",{Annotation:{name:Re.$type,properties:{args:{name:Re.args,defaultValue:[],optional:!0},name:{name:Re.name}},superTypes:[]},AnnotationArg:{name:Y.$type,properties:{identValue:{name:Y.identValue,optional:!0},numberValue:{name:Y.numberValue,optional:!0},stringValue:{name:Y.stringValue,optional:!0}},superTypes:[]},Assignment:{name:W.$type,properties:{},superTypes:[]},Declaration:{name:ve.$type,properties:{},superTypes:[]},EntityDecl:{name:N.$type,properties:{assignments:{name:N.assignments,defaultValue:[],optional:!0},name:{name:N.name},superType:{name:N.superType,referenceType:N.$type,optional:!0},type:{name:N.type,referenceType:x.$type}},superTypes:[W.$type,ve.$type]},EnumTypeRef:{name:ze.$type,properties:{values:{name:ze.values,defaultValue:[]}},superTypes:[B.$type]},IdentValue:{name:qe.$type,properties:{value:{name:qe.value}},superTypes:[_.$type]},Import:{name:Ze.$type,properties:{path:{name:Ze.path}},superTypes:[]},ListTypeRef:{name:Ye.$type,properties:{element:{name:Ye.element}},superTypes:[B.$type]},ListValue:{name:He.$type,properties:{items:{name:He.items,defaultValue:[],optional:!0}},superTypes:[_.$type]},Measurement:{name:Te.$type,properties:{amount:{name:Te.amount},unit:{name:Te.unit}},superTypes:[_.$type]},MemberDecl:{name:P.$type,properties:{annotations:{name:P.annotations,defaultValue:[],optional:!0},default:{name:P.default,optional:!0},name:{name:P.name},optional:{name:P.optional,defaultValue:!1,optional:!0},type:{name:P.type}},superTypes:[]},Model:{name:xe.$type,properties:{declarations:{name:xe.declarations,defaultValue:[],optional:!0},imports:{name:xe.imports,defaultValue:[],optional:!0}},superTypes:[]},NamedTypeRef:{name:Je.$type,properties:{typeName:{name:Je.typeName}},superTypes:[B.$type]},NumberValue:{name:Xe.$type,properties:{value:{name:Xe.value}},superTypes:[_.$type]},RefTypeRef:{name:Qe.$type,properties:{target:{name:Qe.target,referenceType:x.$type}},superTypes:[B.$type]},ScalarAssignment:{name:H.$type,properties:{annotations:{name:H.annotations,defaultValue:[],optional:!0},name:{name:H.name},value:{name:H.value}},superTypes:[W.$type]},StructAssignment:{name:J.$type,properties:{annotations:{name:J.annotations,defaultValue:[],optional:!0},fields:{name:J.fields,defaultValue:[],optional:!0},name:{name:J.name}},superTypes:[W.$type]},TextValue:{name:et.$type,properties:{value:{name:et.value}},superTypes:[_.$type]},TypeDecl:{name:x.$type,properties:{annotations:{name:x.annotations,defaultValue:[],optional:!0},members:{name:x.members,defaultValue:[],optional:!0},name:{name:x.name},superType:{name:x.superType,referenceType:x.$type,optional:!0},traits:{name:x.traits,defaultValue:[],optional:!0}},superTypes:[ve.$type]},TypeRef:{name:B.$type,properties:{},superTypes:[]},Unit:{name:tt.$type,properties:{unit:{name:tt.unit,defaultValue:[]}},superTypes:[]},Use:{name:X.$type,properties:{overrides:{name:X.overrides,defaultValue:[],optional:!0},target:{name:X.target,referenceType:N.$type},type:{name:X.type,referenceType:x.$type}},superTypes:[W.$type]},Value:{name:_.$type,properties:{},superTypes:[]},VocabTypeRef:{name:nt.$type,properties:{domain:{name:nt.domain}},superTypes:[B.$type]}})}},f=new Q;import{loadGrammarFromJson as Nn}from"langium";var Et,Mt=()=>Et??(Et=Nn(`{
  "$type": "Grammar",
  "isDeclared": true,
  "name": "Biohacking",
  "rules": [
    {
      "$type": "ParserRule",
      "entry": true,
      "name": "Model",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "imports",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@1"
              },
              "arguments": []
            },
            "cardinality": "*"
          },
          {
            "$type": "Assignment",
            "feature": "declarations",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@2"
              },
              "arguments": []
            },
            "cardinality": "*"
          }
        ]
      },
      "fragment": false,
      "parameters": []
    },
    {
      "$type": "ParserRule",
      "name": "Import",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "import"
          },
          {
            "$type": "Assignment",
            "feature": "path",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@30"
              },
              "arguments": []
            }
          }
        ]
      },
      "entry": false,
      "fragment": false,
      "parameters": []
    },
    {
      "$type": "ParserRule",
      "name": "Declaration",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@3"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@13"
            },
            "arguments": []
          }
        ]
      },
      "entry": false,
      "fragment": false,
      "parameters": []
    },
    {
      "$type": "ParserRule",
      "name": "TypeDecl",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "type"
          },
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@26"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "extends"
              },
              {
                "$type": "Assignment",
                "feature": "superType",
                "operator": "=",
                "terminal": {
                  "$type": "CrossReference",
                  "type": {
                    "$ref": "#/rules@3"
                  },
                  "terminal": {
                    "$type": "RuleCall",
                    "rule": {
                      "$ref": "#/rules@26"
                    },
                    "arguments": []
                  },
                  "deprecatedSyntax": false,
                  "isMulti": false
                }
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "is"
              },
              {
                "$type": "Assignment",
                "feature": "traits",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@26"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": ","
                  },
                  {
                    "$type": "Assignment",
                    "feature": "traits",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@26"
                      },
                      "arguments": []
                    }
                  }
                ],
                "cardinality": "*"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "annotations",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@5"
              },
              "arguments": []
            },
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": "{"
          },
          {
            "$type": "Assignment",
            "feature": "members",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@4"
              },
              "arguments": []
            },
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": "}"
          }
        ]
      },
      "entry": false,
      "fragment": false,
      "parameters": []
    },
    {
      "$type": "ParserRule",
      "name": "MemberDecl",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@26"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "optional",
            "operator": "?=",
            "terminal": {
              "$type": "Keyword",
              "value": "?"
            },
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ":"
          },
          {
            "$type": "Assignment",
            "feature": "type",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@7"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "="
              },
              {
                "$type": "Assignment",
                "feature": "default",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@18"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "annotations",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@5"
              },
              "arguments": []
            },
            "cardinality": "*"
          }
        ]
      },
      "entry": false,
      "fragment": false,
      "parameters": []
    },
    {
      "$type": "ParserRule",
      "name": "Annotation",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "@"
          },
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@26"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Assignment",
                    "feature": "args",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@6"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": ","
                      },
                      {
                        "$type": "Assignment",
                        "feature": "args",
                        "operator": "+=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@6"
                          },
                          "arguments": []
                        }
                      }
                    ],
                    "cardinality": "*"
                  }
                ],
                "cardinality": "?"
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "entry": false,
      "fragment": false,
      "parameters": []
    },
    {
      "$type": "ParserRule",
      "name": "AnnotationArg",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "stringValue",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@30"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "identValue",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@26"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "numberValue",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@28"
              },
              "arguments": []
            }
          }
        ]
      },
      "entry": false,
      "fragment": false,
      "parameters": []
    },
    {
      "$type": "ParserRule",
      "name": "TypeRef",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@8"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@9"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@10"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@11"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@12"
            },
            "arguments": []
          }
        ]
      },
      "entry": false,
      "fragment": false,
      "parameters": []
    },
    {
      "$type": "ParserRule",
      "name": "ListTypeRef",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "["
          },
          {
            "$type": "Assignment",
            "feature": "element",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@7"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": "]"
          }
        ]
      },
      "entry": false,
      "fragment": false,
      "parameters": []
    },
    {
      "$type": "ParserRule",
      "name": "EnumTypeRef",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "oneof"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "values",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@26"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "values",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@26"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "entry": false,
      "fragment": false,
      "parameters": []
    },
    {
      "$type": "ParserRule",
      "name": "VocabTypeRef",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "Vocab"
          },
          {
            "$type": "Keyword",
            "value": "<"
          },
          {
            "$type": "Assignment",
            "feature": "domain",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@26"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ">"
          }
        ]
      },
      "entry": false,
      "fragment": false,
      "parameters": []
    },
    {
      "$type": "ParserRule",
      "name": "RefTypeRef",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "Ref"
          },
          {
            "$type": "Keyword",
            "value": "<"
          },
          {
            "$type": "Assignment",
            "feature": "target",
            "operator": "=",
            "terminal": {
              "$type": "CrossReference",
              "type": {
                "$ref": "#/rules@3"
              },
              "terminal": {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@26"
                },
                "arguments": []
              },
              "deprecatedSyntax": false,
              "isMulti": false
            }
          },
          {
            "$type": "Keyword",
            "value": ">"
          }
        ]
      },
      "entry": false,
      "fragment": false,
      "parameters": []
    },
    {
      "$type": "ParserRule",
      "name": "NamedTypeRef",
      "definition": {
        "$type": "Assignment",
        "feature": "typeName",
        "operator": "=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@26"
          },
          "arguments": []
        }
      },
      "entry": false,
      "fragment": false,
      "parameters": []
    },
    {
      "$type": "ParserRule",
      "name": "EntityDecl",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "type",
            "operator": "=",
            "terminal": {
              "$type": "CrossReference",
              "type": {
                "$ref": "#/rules@3"
              },
              "terminal": {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@26"
                },
                "arguments": []
              },
              "deprecatedSyntax": false,
              "isMulti": false
            }
          },
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@30"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "extends"
              },
              {
                "$type": "Assignment",
                "feature": "superType",
                "operator": "=",
                "terminal": {
                  "$type": "CrossReference",
                  "type": {
                    "$ref": "#/rules@13"
                  },
                  "terminal": {
                    "$type": "RuleCall",
                    "rule": {
                      "$ref": "#/rules@30"
                    },
                    "arguments": []
                  },
                  "deprecatedSyntax": false,
                  "isMulti": false
                }
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": "{"
          },
          {
            "$type": "Assignment",
            "feature": "assignments",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@14"
              },
              "arguments": []
            },
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": "}"
          }
        ]
      },
      "entry": false,
      "fragment": false,
      "parameters": []
    },
    {
      "$type": "ParserRule",
      "name": "Assignment",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@15"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@16"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@13"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@17"
            },
            "arguments": []
          }
        ]
      },
      "entry": false,
      "fragment": false,
      "parameters": []
    },
    {
      "$type": "ParserRule",
      "name": "ScalarAssignment",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@26"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ":"
          },
          {
            "$type": "Assignment",
            "feature": "value",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@18"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "annotations",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@5"
              },
              "arguments": []
            },
            "cardinality": "*"
          }
        ]
      },
      "entry": false,
      "fragment": false,
      "parameters": []
    },
    {
      "$type": "ParserRule",
      "name": "StructAssignment",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@26"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": "{"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "fields",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@14"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": ",",
                    "cardinality": "?"
                  },
                  {
                    "$type": "Assignment",
                    "feature": "fields",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@14"
                      },
                      "arguments": []
                    }
                  }
                ],
                "cardinality": "*"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": "}"
          },
          {
            "$type": "Assignment",
            "feature": "annotations",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@5"
              },
              "arguments": []
            },
            "cardinality": "*"
          }
        ]
      },
      "entry": false,
      "fragment": false,
      "parameters": []
    },
    {
      "$type": "ParserRule",
      "name": "Use",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "use"
          },
          {
            "$type": "Assignment",
            "feature": "type",
            "operator": "=",
            "terminal": {
              "$type": "CrossReference",
              "type": {
                "$ref": "#/rules@3"
              },
              "terminal": {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@26"
                },
                "arguments": []
              },
              "deprecatedSyntax": false,
              "isMulti": false
            }
          },
          {
            "$type": "Assignment",
            "feature": "target",
            "operator": "=",
            "terminal": {
              "$type": "CrossReference",
              "type": {
                "$ref": "#/rules@13"
              },
              "terminal": {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@30"
                },
                "arguments": []
              },
              "deprecatedSyntax": false,
              "isMulti": false
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "{"
              },
              {
                "$type": "Assignment",
                "feature": "overrides",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@14"
                  },
                  "arguments": []
                },
                "cardinality": "*"
              },
              {
                "$type": "Keyword",
                "value": "}"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "entry": false,
      "fragment": false,
      "parameters": []
    },
    {
      "$type": "ParserRule",
      "name": "Value",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@23"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@19"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@20"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@21"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@22"
            },
            "arguments": []
          }
        ]
      },
      "entry": false,
      "fragment": false,
      "parameters": []
    },
    {
      "$type": "ParserRule",
      "name": "ListValue",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "["
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "items",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@18"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": ","
                  },
                  {
                    "$type": "Assignment",
                    "feature": "items",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@18"
                      },
                      "arguments": []
                    }
                  }
                ],
                "cardinality": "*"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": "]"
          }
        ]
      },
      "entry": false,
      "fragment": false,
      "parameters": []
    },
    {
      "$type": "ParserRule",
      "name": "TextValue",
      "definition": {
        "$type": "Assignment",
        "feature": "value",
        "operator": "=",
        "terminal": {
          "$type": "Alternatives",
          "elements": [
            {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@30"
              },
              "arguments": []
            },
            {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@29"
              },
              "arguments": []
            }
          ]
        }
      },
      "entry": false,
      "fragment": false,
      "parameters": []
    },
    {
      "$type": "ParserRule",
      "name": "IdentValue",
      "definition": {
        "$type": "Assignment",
        "feature": "value",
        "operator": "=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@26"
          },
          "arguments": []
        }
      },
      "entry": false,
      "fragment": false,
      "parameters": []
    },
    {
      "$type": "ParserRule",
      "name": "NumberValue",
      "definition": {
        "$type": "Assignment",
        "feature": "value",
        "operator": "=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@28"
          },
          "arguments": []
        }
      },
      "entry": false,
      "fragment": false,
      "parameters": []
    },
    {
      "$type": "ParserRule",
      "name": "Measurement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "amount",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@27"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "unit",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@24"
              },
              "arguments": []
            }
          }
        ]
      },
      "entry": false,
      "fragment": false,
      "parameters": []
    },
    {
      "$type": "ParserRule",
      "name": "Unit",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "unit",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@26"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "/"
              },
              {
                "$type": "Assignment",
                "feature": "unit",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@26"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "entry": false,
      "fragment": false,
      "parameters": []
    },
    {
      "$type": "TerminalRule",
      "hidden": true,
      "name": "WS",
      "definition": {
        "$type": "RegexToken",
        "regex": "/\\\\s+/",
        "parenthesized": false
      },
      "fragment": false
    },
    {
      "$type": "TerminalRule",
      "name": "ID",
      "definition": {
        "$type": "RegexToken",
        "regex": "/[_a-zA-Z][\\\\w_]*/",
        "parenthesized": false
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "MEASURED_NUMBER",
      "type": {
        "$type": "ReturnType",
        "name": "number"
      },
      "definition": {
        "$type": "RegexToken",
        "regex": "/[0-9]+(\\\\.[0-9]+)?(?=[ \\\\t]*[a-zA-Z])/",
        "parenthesized": false
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "NUMBER",
      "type": {
        "$type": "ReturnType",
        "name": "number"
      },
      "definition": {
        "$type": "RegexToken",
        "regex": "/[0-9]+(\\\\.[0-9]+)?/",
        "parenthesized": false
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "MULTISTRING",
      "definition": {
        "$type": "RegexToken",
        "regex": "/'''[\\\\s\\\\S]*?'''/",
        "parenthesized": false
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "STRING",
      "definition": {
        "$type": "RegexToken",
        "regex": "/\\"(\\\\\\\\.|[^\\"\\\\\\\\])*\\"|'(\\\\\\\\.|[^'\\\\\\\\])*'/",
        "parenthesized": false
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "hidden": true,
      "name": "ML_COMMENT",
      "definition": {
        "$type": "RegexToken",
        "regex": "/\\\\/\\\\*[\\\\s\\\\S]*?\\\\*\\\\//",
        "parenthesized": false
      },
      "fragment": false
    },
    {
      "$type": "TerminalRule",
      "hidden": true,
      "name": "SL_COMMENT",
      "definition": {
        "$type": "RegexToken",
        "regex": "/\\\\/\\\\/[^\\\\n\\\\r]*/",
        "parenthesized": false
      },
      "fragment": false
    }
  ],
  "imports": [],
  "interfaces": [],
  "types": []
}`));var Un={languageId:"biohacking",fileExtensions:[".bio"],caseInsensitive:!1,mode:"development"},wt={AstReflection:()=>new Q},Ct={Grammar:()=>Mt(),LanguageMetaData:()=>Un,parser:{}};import{AstUtils as de}from"langium";var ke="interaction",Ln=["critical","high","moderate"],Pn={critical:"high",high:"medium",moderate:"low"},Bn={high:"critical",medium:"high",low:"moderate"};function Nt(n){return Pn[n]}function rt(n){return n.note!==void 0&&n.weight!==void 0&&n.relType==="negative"}function Vt(n,t){return[n.toLowerCase(),t.toLowerCase()].sort().join("|")}var re=class{constructor(t=[]){h(this,"byPair",new Map);for(let e of t){let r=Vt(e.a,e.b);this.byPair.has(r)||this.byPair.set(r,e)}}get size(){return this.byPair.size}find(t,e){return this.byPair.get(Vt(t,e))}entries(){return[...this.byPair.values()]}};function Ie(n,t){for(let e of n.assignments){if(!d(e)||e.name!==t)continue;let r=e.value;if(I(r)||$(r))return String(r.value)}}function _n(n){let t=Ie(n,"a"),e=Ie(n,"b"),r=Ie(n,"message"),i=Ie(n,"severity");if(!(!t||!e||!r||!i||!Ln.includes(i)))return{name:n.name,a:t,b:e,message:r,severity:i}}function it(n){let t=[];for(let e of n.declarations){if(!y(e)||!On(e))continue;let r=_n(e);r&&t.push(r)}return t}function On(n){if(n.type?.$refText===ke)return!0;let t=n.type?.ref?.superType?.ref,e=new Set;for(;t&&!e.has(t);){if(t.name===ke)return!0;e.add(t),t=t.superType?.ref}return!1}function Kn(n){let t=[];for(let e of n.interactions)rt(e)&&t.push({name:e.source??`${e.entities[0]} + ${e.entities[1]}`,a:e.entities[0],b:e.entities[1],severity:Bn[e.weight]??"moderate",message:e.note});return t}function Ut(n){return new re(Kn(n))}import{URI as Lt}from"vscode-uri";import{STD_SPECIFIERS as Pt,BUILTIN_SPECIFIERS as Bt}from"../bundled/bundled-specifiers.js";var _t="@std/",Ae="@builtin/",Ot="bundled",ot="builtin",Kt=[_t,Ae];function fi(n){return n.startsWith(_t)}function yi(n){return n.startsWith(Ae)}function Gn(n){return Kt.some(t=>n.startsWith(t))}function O(n){return n.scheme===ot}function ie(n){return n.scheme===Ot||n.scheme===ot}function st(n){return n.endsWith(".bio")?n.slice(0,-4):n}function se(n){let t=Kt.find(i=>n.startsWith(i));if(!t)return;let e=st(n.slice(t.length));if(!e)return;if(t===Ae)return Lt.from({scheme:ot,path:`/${e}.bio`});let r=t.slice(1,-1);return Lt.from({scheme:Ot,path:`/${r}/${e}.bio`})}function at(){return jn().map(se).filter(n=>n!==void 0)}function Gt(n){if(O(n)){let a=st(n.path.replace(/^\//,""));return a?`${Ae}${a}`:void 0}if(!ie(n))return;let t=n.path.replace(/^\//,""),e=t.indexOf("/");if(e<=0)return;let r=t.slice(0,e),i=st(t.slice(e+1));if(!i)return;let s=`@${r}/${i}`;return Gn(s)?s:void 0}function jt(){return[...Pt]}function jn(){return[...Bt]}function gi(){return[...Pt,...Bt]}function w(n){let t=n.trim(),e=/^PMID:(\d{1,9})$/i.exec(t);if(e)return{kind:"PMID",id:e[1]};let r=/^(?:DOI:)?(10\.\d{4,9}\/.+)$/i.exec(t);if(r)return{kind:"DOI",id:r[1]}}function ae(n){let t=n.id.replace(/\(/g,"%28").replace(/\)/g,"%29");return n.kind==="PMID"?`https://pubmed.ncbi.nlm.nih.gov/${n.id}/`:`https://doi.org/${t}`}function Se(n){return`${n.kind}:${n.id}`}function Ft(n){let t=[];for(let e of n.split(",")){let r=w(e);r&&t.push(r)}return t}var Fn=/\bPMID:\d{1,9}\b/gi,Wn=/\b(?:DOI:)?10\.\d{4,9}\/[^\s]+/gi,zn=new RegExp(`(${Fn.source})|(${Wn.source})`,"gi");function qn(n){let t=/^(.*?)([.,;:!?)\]}"']*)$/.exec(n),e=t?t[1]:n,r=t?t[2]:"";for(;r.startsWith(")")&&(e.match(/\(/g)??[]).length>(e.match(/\)/g)??[]).length;)e+=")",r=r.slice(1);return{core:e,trailing:r}}function Wt(n){if(!n)return n;let t=[];return n.replace(/\[[^\]]*\]\([^)]*\)/g,i=>(t.push(i),`\0${t.length-1}\0`)).replace(zn,(i,s,a)=>{if(s){let l=w(s);return l?`[${Se(l)}](${ae(l)})`:i}let{core:o,trailing:u}=qn(a??i),c=w(o);return c?`[${o}](${ae(c)})${u}`:i}).replace(/\u0000(\d+)\u0000/g,(i,s)=>t[Number(s)])}var Zn=new Set(["kg","lb"]);function ue(n){for(let t=1;t<n.length;t++){let e=n[t].toLowerCase();if(Zn.has(e))return e}}var zt=.45359237;function Yn(n,t){let e=t.toLowerCase();if(e==="kg")return n;if(e==="lb")return n*zt}function ut(n,t){let e=10**t;return Math.round(n*e)/e}function qt(n,t,e){let r=ue(t);if(!r)return;let i=Yn(e.amount,e.unit);if(i===void 0||!Number.isFinite(i)||i<=0)return;let s=r==="lb"?i/zt:i;if(!Number.isFinite(s)||s<=0)return;let a=n*s,o=ut(a,4);return{value:o,unit:t[0],perKgUnit:t.join("/"),weightAmount:ut(s,2),weightUnit:r,rounded:o!==a}}function Zt(n){let t=[],e=r=>{for(let i of r)d(i)?v(i.value)&&t.push(i.value):b(i)&&e(i.fields)};return e(n.assignments),t}function De(n){let t;return n.shared.workspace.LangiumDocuments.all.forEach(e=>{if(t||ie(e.uri)||O(e.uri))return;let r=e.parseResult?.value;if(E(r)){for(let i of r.declarations)if(!(!y(i)||i.type?.ref?.name!=="user"))for(let s of i.assignments){if(!d(s)||s.name!=="weight"||!v(s.value))continue;let a=s.value.unit.unit,o=s.value.amount;if(!(a.length===0||!Number.isFinite(o)||o<=0)){t={amount:o,unit:a.join("/")};return}}}}),t}function Yt(n,t){let e=oe(n.value),r=oe(n.weightAmount);return`${oe(t)} ${n.perKgUnit} \xD7 ${r} ${n.weightUnit} = ${n.rounded?"\u2248 ":""}${e} ${n.unit}`}function oe(n){return String(ut(n,4))}import{AstUtils as Hn}from"langium";var Jn=["Number","String","Text","Bool","Ident","Measurement"];function K(n){return Jn.includes(n)}var Ee=["pharmacokinetic","interacting","schedulable"],Me=["violet","blue","sky","emerald","amber","rose","slate"],U=class n{constructor(t,e=[]){h(this,"types",new Map);for(let r of t.declarations)M(r)&&this.types.set(r.name,r);for(let r of e)this.types.has(r.name)||this.types.set(r.name,r)}static forNode(t,e=[]){let r=Hn.getContainerOfType(t,i=>i.$type==="Model");return r?new n(r,e):void 0}get(t){return this.types.get(t)}has(t){return this.types.has(t)}allTypeNames(){return[...this.types.keys()]}chain(t){let e=this.types.get(t);return e?le(e,this):[]}isSubtypeOf(t,e){return this.chain(t).some(r=>r.name===e)}extendsCycle(t){let e=new Set,r=this.types.get(t);for(;r;){if(e.has(r.name))return r.name;e.add(r.name);let i=r.superType?.$refText;if(!i)return;if(e.has(i))return i;r=this.types.get(i)}}members(t){let e=new Map;for(let r of this.chain(t).reverse())for(let i of r.members)e.set(i.name,i);return e}member(t,e){return this.members(t).get(e)}traits(t){let e=new Set;for(let r of this.chain(t))for(let i of r.traits)e.add(i);return e}hasTrait(t,e){return this.traits(t).has(e)}defaultMember(t){for(let e of this.chain(t)){let i=e.annotations.find(s=>s.name==="default_member")?.args[0];if(i?.identValue)return i.identValue}}};function le(n,t){let e=[],r=new Set,i=n;for(;i&&!r.has(i);){r.add(i),e.push(i);let s=i.superType?.$refText;i=i.superType?.ref??(s?t?.get(s):void 0)}return e}function S(n,t){let e=new Map;for(let r of le(n,t).reverse())for(let i of r.members)e.set(i.name,i);return e}function Xn(n,t){let e=new Set;for(let r of le(n,t))for(let i of r.traits)e.add(i);return e}function we(n,t,e){return Xn(n,e).has(t)}function Ce(n,t,e){return le(n,e).some(r=>r===t||r.name===t.name)}function Ht(n,t){for(let e of le(n,t)){let i=e.annotations.find(s=>s.name==="default_member")?.args[0];if(i?.identValue)return i.identValue}}function Jt(n,t){let e=new Set,r=n;for(;r;){if(e.has(r))return r.name;e.add(r);let i=r.superType?.$refText,s=r.superType?.ref??(i?t?.get(i):void 0);if(s&&e.has(s))return s.name;r=s}}function pe(n){switch(n.$type){case"ListTypeRef":return`[${pe(n.element)}]`;case"EnumTypeRef":return`oneof(${n.values.join(", ")})`;case"VocabTypeRef":return`Vocab<${n.domain}>`;case"RefTypeRef":return`Ref<${n.target.$refText}>`;default:return n.typeName}}function A(n){return v(n)?"a measurement":ne(n)?"a number":I(n)?"a string":ee(n)?"a list":$(n)?`the identifier '${n.value}'`:"a value"}function ce(n,t,e){let r=pe(t);switch(t.$type){case"ListTypeRef":{if(ee(n)){for(let i of n.items){let s=ce(i,t.element,e);if(s)return s}return}return ce(n,t.element,e)}case"EnumTypeRef":return $(n)?t.values.includes(n.value)?void 0:{expected:r,actual:`'${n.value}'`}:{expected:r,actual:A(n)};case"VocabTypeRef":return I(n)||$(n)?void 0:{expected:r,actual:A(n)};case"RefTypeRef":return I(n)||$(n)?void 0:{expected:r,actual:A(n)};default:{let i=t.typeName;switch(i){case"Number":return ne(n)?void 0:{expected:r,actual:A(n)};case"Measurement":return v(n)?void 0:{expected:r,actual:A(n)};case"String":case"Text":return I(n)||$(n)?void 0:{expected:r,actual:A(n)};case"Ident":return $(n)?void 0:{expected:r,actual:A(n)};case"Bool":return $(n)&&(n.value==="true"||n.value==="false")?void 0:{expected:r,actual:A(n)};default:{let s=e.defaultMember(i);if(s){let a=e.member(i,s);if(a)return ce(n,a.type,e)}return e.has(i)?{expected:r,actual:A(n)}:{expected:`${r} (unknown type)`,actual:A(n)}}}}}}function Qn(n,t){let e=n.length+1,r=t.length+1,i=Array.from({length:r},(s,a)=>a);for(let s=1;s<e;s++){let a=[s];for(let o=1;o<r;o++)a[o]=Math.min(i[o]+1,a[o-1]+1,i[o-1]+(n[s-1]===t[o-1]?0:1));i=a}return i[r-1]}function me(n,t){let e=Math.max(2,Math.floor(n.length/3)),r,i=Number.POSITIVE_INFINITY;for(let s of t){if(s===n)return;let a=Qn(n.toLowerCase(),s.toLowerCase());a<i&&a<=e&&(r=s,i=a)}return r}import{AstUtils as er}from"langium";import{InferenceRuleNotApplicable as tr}from"typir";var nr={Text:"String"};function lt(n){return te(n)}var Ve=class{onInitialize(t){let e=t.factory.Primitives.create({primitiveName:"Number"}).inferenceRule({languageKey:"NumberValue"}).finish(),r=t.factory.Primitives.create({primitiveName:"Measurement"}).inferenceRule({languageKey:"Measurement"}).finish(),i=t.factory.Primitives.create({primitiveName:"String"}).inferenceRule({languageKey:"TextValue"}).finish(),s=t.factory.Primitives.create({primitiveName:"Ident"}).inferenceRule({languageKey:"IdentValue",matching:o=>!Xt(o)}).finish(),a=t.factory.Primitives.create({primitiveName:"Bool"}).inferenceRule({languageKey:"IdentValue",matching:o=>Xt(o)}).finish();t.Conversion.markAsConvertible(a,s,"IMPLICIT_EXPLICIT"),t.Conversion.markAsConvertible(s,i,"IMPLICIT_EXPLICIT"),t.Inference.addInferenceRulesForAstNodes({EntityDecl:o=>o.type?.ref??tr}),t.validation.Collector.addValidationRulesForAstNodes({EntityDecl:(o,u)=>this.checkAssignments(o,u,t),Use:(o,u)=>this.checkUseTarget(o,u,t)})}onNewAstNode(t,e){if(!M(t))return;let r=this.fieldsOf(t,e),i=e.factory.Classes.create({className:t.name,superClasses:t.superType?.ref?ct(t.superType.ref.name):void 0,fields:r,methods:[]}).inferenceRuleForClassDeclaration({languageKey:"TypeDecl",matching:a=>a===t}).finish(),s=Ht(t);if(s){let a=S(t).get(s),o=a&&this.resolveTypeRef(a.type,e);o&&i.addListener(u=>{e.Conversion.getConversion(o,u)==="NONE"&&e.Conversion.markAsConvertible(o,u,"IMPLICIT_EXPLICIT")})}}fieldsOf(t,e){let r=[];for(let i of t.members){let s=this.resolveTypeRef(i.type,e);s&&r.push({name:i.name,type:s})}return r}resolveTypeRef(t,e){if(!te(t))return;let r=nr[t.typeName]??t.typeName;return K(r)?e.factory.Primitives.get({primitiveName:r}):e.infrastructure.TypeResolver.tryToResolve(ct(r))}checkAssignments(t,e,r){let i=t.type?.ref;if(!i)return;let s=S(i,void 0);t.assignments.forEach((a,o)=>{if(!d(a))return;let u=s.get(a.name);if(!u||!lt(u.type))return;let c=this.resolveTypeRef(u.type,r);c&&r.validation.Constraints.ensureNodeIsAssignable(a.value,c,e,(l,p)=>({message:`Property '${a.name}' expects ${p.userRepresentation}, but got ${l.userRepresentation}.`,languageNode:t,languageProperty:"assignments",languageIndex:o,severity:"error"}))})}checkUseTarget(t,e,r){let i=t.type?.ref,s=t.target?.ref;if(!i||!s||!s.type?.ref)return;let a=r.infrastructure.TypeResolver.tryToResolve(ct(i.name));a&&r.validation.Constraints.ensureNodeIsAssignable(s,a,e,(o,u)=>({message:`'${t.target.$refText}' is a ${o.name}, not a ${u.name}.`,languageNode:t,languageProperty:"target",severity:"error"}))}};function ct(n){return()=>`class-${n}`}function Xt(n){let t=n.value;return t==="true"||t==="false"}function Ei(n){let t=er.getContainerOfType(n,e=>e.$type==="Model");return t?t.declarations.filter(M):[]}function Mi(n){return n.declarations.filter(y)}var rr={mcg:1,\u03BCg:1,mg:1e3,g:1e6,kg:1e9,ng:.001};function Qt(n){let t=rr[n.unit.toLowerCase()];return t===void 0?void 0:n.amount*t}function ir(n,t){let e=Qt(n),r=Qt(t);if(e!==void 0&&r!==void 0)return[e,r];if(n.unit.toLowerCase()===t.unit.toLowerCase())return[n.amount,t.amount]}function rn(n){return(R(n)?n.overrides:n.assignments).filter(d).map(e=>({name:e.name,value:e.value}))}function en(n,t){let e=rn(n).find(s=>s.name===t);if(!e)return[];let r=e.value,i=s=>s?.$type==="TextValue"||s?.$type==="IdentValue"?[String(s.value)]:[];return r.$type==="ListValue"?r.items.flatMap(i):i(r)}function sn(n,t){let r=rn(n).find(i=>i.name===t)?.value;if(r?.$type==="Measurement")return{amount:r.amount,unit:r.unit.unit.join("/")}}function sr(n){let t=sn(n,"dose");if(t)return t;let e=n.assignments.filter(b).find(r=>r.name==="dose");if(e)for(let r of["amount","max"]){let s=e.fields.filter(d).find(a=>a.name===r)?.value;if(s?.$type==="Measurement")return{amount:s.amount,unit:s.unit.unit.join("/")}}}function on(n){return[...new Set(n)]}function z(n){return n.target?.ref}function tn(n){let t=[];for(let e of n.assignments)if(y(e))t.push(e);else if(R(e)){let r=z(e);r&&t.push(r)}return t}function Le(n,t){let e=[];for(let r of n.assignments){let i=y(r)?r:R(r)?z(r):void 0,s=i?.type?.ref;i&&s&&we(s,"pharmacokinetic",t)&&e.push(i)}return e}function nn(n,t,e){let r=Le(n,e),i=s=>on([...r.flatMap(a=>en(a,s)),...en(n,s)]);return{node:t,name:n.name,targets:i("targets"),conflicts:i("conflicts"),synergies:i("synergies"),sourceNames:r.map(s=>s.name)}}function Ne(n,t){let e=[];for(let r of n.assignments)if(y(r))e.push(nn(r,r,t));else if(R(r)){let i=z(r);i&&e.push(nn(i,r,t))}return e}function Ue(n){return R(n)?{node:n,property:"target"}:{node:n,property:"name"}}function an(n){let t=n.validation.ValidationRegistry,e=n.validation.BiohackingValidator,r={TypeDecl:[e.checkTraitVocabulary.bind(e),e.checkTypeExtendsCycle.bind(e),e.checkDuplicateMembers.bind(e),e.checkMemberTypesResolve.bind(e),e.checkColorVocabulary.bind(e)],EntityDecl:[e.checkUnknownMembers.bind(e),e.checkValueTypes.bind(e),e.checkRequiredMembers.bind(e),e.checkEntityExtendsCycle.bind(e),e.checkEntityExtendsResolves.bind(e),e.checkDoseExceedsMax.bind(e),e.checkConflictingContents.bind(e),e.checkKnownInteractions.bind(e),e.checkTargetOverlap.bind(e),e.checkCrossMarkerConflicts.bind(e),e.checkMissingSynergies.bind(e),e.checkUseCycles.bind(e),e.checkPerKgWithoutWeight.bind(e)],ScalarAssignment:[e.checkEvidenceAnnotations.bind(e)],StructAssignment:[e.checkEvidenceAnnotations.bind(e)],Model:[e.checkDuplicateIdentities.bind(e),e.checkInlineEntityShadowing.bind(e)]};t.register(r,e)}var Pe=class{constructor(t){h(this,"services",t);h(this,"builtinCatalog")}index(t){let e=de.getContainerOfType(t,a=>a.$type==="Model");if(!e)return;let r=y(t)||R(t)?t.type?.ref:void 0,i=r?de.getContainerOfType(r,a=>a.$type==="Model"):void 0,s=i&&i!==e?i.declarations.filter(a=>a.$type==="TypeDecl"):[];return new U(e,s)}checkTraitVocabulary(t,e){t.traits.forEach((r,i)=>{if(Ee.includes(r))return;let s=me(r,Ee);e("warning",`Unknown trait '${r}'.${s?` Did you mean '${s}'?`:""} Known traits: ${Ee.join(", ")}.`,{node:t,property:"traits",index:i})})}checkColorVocabulary(t,e){t.annotations.forEach((r,i)=>{if(r.name!=="color")return;let s=r.args[0]?.stringValue??r.args[0]?.identValue;if(s===void 0||Me.includes(s))return;let a=me(s,Me);e("warning",`Unknown color '${s}'.${a?` Did you mean '${a}'?`:""} Valid colors: ${Me.join(", ")}.`,{node:t,property:"annotations",index:i})})}checkEvidenceAnnotations(t,e){t.annotations.forEach((r,i)=>{if(r.name!=="evidence")return;let s=r.args[0]?.stringValue;if(s===void 0){e("warning",'@evidence requires a string argument, e.g. @evidence("PMID:4110897").',{node:t,property:"annotations",index:i});return}w(s)||e("warning",`Unrecognized evidence reference '${s}' \u2014 expected PMID:<id> or DOI:<doi>.`,{node:t,property:"annotations",index:i})})}checkPerKgWithoutWeight(t,e){let r=Zt(t).filter(s=>ue(s.unit.unit)!==void 0);if(r.length===0||this.services&&De(this.services))return;let i=r[0].unit.unit.join("/");e("warning",`Body-weight-relative dose (${i}) but no user weight in the workspace \u2014 add e.g. user "You" { weight: 82 kg } so doses can resolve.`,{node:r[0]})}checkTypeExtendsCycle(t,e){let r=Jt(t,this.index(t));r&&e("error",`Cycle detected in type extension: ${r}.`,{node:t,property:"superType"})}checkDuplicateMembers(t,e){let r=new Set;t.members.forEach((i,s)=>{r.has(i.name)&&e("error",`Duplicate member '${i.name}' on type '${t.name}'.`,{node:t,property:"members",index:s}),r.add(i.name)})}checkMemberTypesResolve(t,e){let r=this.index(t);r&&t.members.forEach((i,s)=>{let a=i.type;for(;a?.$type==="ListTypeRef";)a=a.element;if(a?.$type!=="NamedTypeRef")return;let o=a.typeName;if(K(o)||r.has(o))return;let u=me(o,[...r.allTypeNames(),"Number","String","Text","Bool","Ident","Measurement"]);e("error",`Unknown type '${o}' for member '${i.name}'.${u?` Did you mean '${u}'?`:""}`,{node:t,property:"members",index:s})})}checkUnknownMembers(t,e){let r=t.type?.ref;if(!r)return;let i=this.index(t),s=r.name,a=S(r,i);t.assignments.forEach((o,u)=>{if(!d(o)&&!b(o)||a.has(o.name))return;let c=me(o.name,a.keys());e("error",`Unknown property '${o.name}' on type '${s}'.`+(c?` Did you mean '${c}'?`:""),{node:t,property:"assignments",index:u})})}checkValueTypes(t,e){let r=t.type?.ref;if(!r)return;let i=this.index(t),s=S(r,i);t.assignments.forEach((a,o)=>{if(!d(a))return;let u=s.get(a.name);if(!u||lt(u.type))return;let c=ce(a.value,u.type,i);c&&e("error",`Property '${a.name}' expects ${c.expected}, but got ${c.actual}.`,{node:t,property:"assignments",index:o})})}checkRequiredMembers(t,e){let r=t.type?.ref;if(!r)return;let i=this.index(t),s=r.name;if(t.superType)return;let a=new Set(t.assignments.flatMap(u=>d(u)||b(u)?[u.name]:[])),o=[];for(let[u,c]of S(r,i))c.optional||c.default||c.type.$type!=="ListTypeRef"&&(a.has(u)||o.push(u));o.length>0&&e("warning",`Type '${s}' declares required ${o.length===1?"property":"properties"} not set here: ${o.join(", ")}.`,{node:t,property:"name"})}checkEntityExtendsCycle(t,e){let r=new Set,i=t;for(;i;){if(r.has(i.name)){e("error",`Circular extends detected for '${t.name}'.`,{node:t,property:"superType"});return}r.add(i.name),i=i.superType?.ref}}checkEntityExtendsResolves(t,e){t.superType&&(t.superType.ref||e("warning",`Base '${t.superType.$refText}' could not be resolved. Properties will not be inherited.`,{node:t,property:"superType"}))}checkDoseExceedsMax(t,e){let r=this.index(t),i=t.type?.$refText;if(!r||!i)return;let s=sr(t);if(s)for(let a of tn(t)){let o=a.type?.ref;if(!o||!we(o,"pharmacokinetic",r))continue;let u=sn(a,"max_dose");if(!u)continue;let c=ir(s,u);if(!c)continue;let[l,p]=c;l>p&&e("error",`Dose ${s.amount} ${s.unit} exceeds max_dose ${u.amount} ${u.unit} of '${a.name}'.`,{node:t,property:"assignments"})}}checkConflictingContents(t,e){let r=this.index(t),i=Ne(t,r);if(!(i.length<2))for(let s=0;s<i.length;s++)for(let a=s+1;a<i.length;a++){let o=i[s],u=i[a],c=[o.name,...o.sourceNames],l=[u.name,...u.sourceNames];(c.some(m=>u.conflicts.includes(m))||l.some(m=>o.conflicts.includes(m)))&&e("error",`Drug interaction conflict: "${o.name}" and "${u.name}" are listed as conflicting substances. Combining them may cause dangerous interactions.`,Ue(u.node))}}checkTargetOverlap(t,e){let r=Ne(t,this.index(t));if(r.length<2)return;let i=new Map;for(let s of r)for(let a of s.targets){let o=i.get(a)??[];o.push(s),i.set(a,o)}for(let[s,a]of i)if(!(a.length<2))for(let o of a)e("info",`Synergy detected: Multiple items in this stack target "${s}".`,Ue(o.node))}checkCrossMarkerConflicts(t,e){if(Le(t,this.index(t)).length>0)return;let r=Ne(t,this.index(t));for(let i of r)for(let s of r)if(i!==s)for(let a of i.targets)s.conflicts.includes(a)&&e("warning",`Potential conflict: "${i.name}" targets "${a}", which is listed as a conflict for "${s.name}".`,Ue(i.node))}checkMissingSynergies(t,e){if(Le(t,this.index(t)).length>0)return;let r=Ne(t,this.index(t));for(let i of r)for(let s of i.synergies)r.some(o=>o!==i&&(o.targets.includes(s)||o.name===s||o.sourceNames.includes(s)))||e("hint",`Synergy suggestion: "${i.name}" has a known synergy with "${s}". Consider adding an intervention that targets "${s}" to this stack.`,Ue(i.node))}checkUseCycles(t,e){let r=new Set,i=s=>{if(s===t&&r.size>0)return!0;if(r.has(s))return!1;r.add(s);for(let a of s.assignments){if(!R(a))continue;let o=z(a);if(o&&i(o))return!0}return!1};for(let s of t.assignments){if(!R(s))continue;let a=z(s);if(a&&i(a)){e("error",`Cycle detected in stack extension: ${t.name}`,{node:t,property:"name"});return}}}checkKnownInteractions(t,e){let r=this.index(t);if(!r)return;let i=tn(t).filter(o=>{let u=o.type?.ref;return u?we(u,"interacting",r):!1});if(i.length<2)return;let s=this.interactionCatalog(t);if(s.size===0)return;let a=o=>on([o.name,...Le(o,r).map(u=>u.name)]);for(let o=0;o<i.length;o++)for(let u=o+1;u<i.length;u++)for(let c of a(i[o]))for(let l of a(i[u])){let p=s.find(c,l);if(!p)continue;let m=p.severity==="critical"?"error":"warning";e(m,`Known interaction between '${c}' and '${l}': ${p.message}`,{node:t,property:"name"})}}interactionCatalog(t){let e=de.getContainerOfType(t,r=>r.$type==="Model");return new re([...e?it(e):[],...this.builtinInteractions()])}builtinInteractions(){if(this.builtinCatalog)return this.builtinCatalog;let t=this.services?.shared.workspace.LangiumDocuments,e=[];for(let r of t?.all??[]){if(!O(r.uri))continue;let i=r.parseResult?.value;i?.$type==="Model"&&e.push(...it(i))}return e.length>0&&(this.builtinCatalog=e),e}checkUseTargetType(t,e){let r=t.type?.ref,i=z(t),s=i?.type?.ref;!r||!i||!s||Ce(s,r,this.index(t))||e("error",`'${i.name}' is a ${s.name}, not a ${r.name}.`,{node:t,property:"target"})}checkDuplicateIdentities(t,e){let r=new U(t),i=[];for(let a of de.streamAllContents(t))y(a)&&i.push(a);let s=new Map;for(let a of i){let o=s.get(a.name)??[];o.push(a),s.set(a.name,o)}for(let[a,o]of s)if(!(o.length<2))for(let u=0;u<o.length;u++)for(let c=u+1;c<o.length;c++){let l=o[u].type?.ref,p=o[c].type?.ref;!l||!p||(Ce(l,p,r)||Ce(p,l,r))&&e("error",`Duplicate declaration of '${a}': '${l.name}' and '${p.name}' are in the same type hierarchy.`,{node:o[c],property:"name"})}}checkInlineEntityShadowing(t,e){let r=[];for(let o of de.streamAllContents(t))y(o)&&r.push(o);let i=new Set(r.filter(o=>o.$container===t).map(o=>o.name)),s=r.filter(o=>o.$container!==t),a=new Map;for(let o of s){let u=a.get(o.name)??[];u.push(o),a.set(o.name,u)}for(let o of s){let u=o.type?.ref?.name??o.type?.$refText??"entity",c=`use ${u} "${o.name}"`;if(i.has(o.name)){e("warning",`Inline ${u} "${o.name}" shadows a top-level declaration \u2014 values may diverge. Consider extracting it to a top-level declaration or using '${c}'.`,{node:o,property:"name"});continue}(a.get(o.name)??[]).some(p=>p!==o)&&e("warning",`Inline ${u} "${o.name}" duplicates another inline declaration elsewhere in this file \u2014 values may diverge. Consider extracting it to a top-level declaration or using '${c}'.`,{node:o,property:"name"})}}};import{DefaultScopeProvider as ur,MapScope as un,AstUtils as cn}from"langium";import{URI as ln,Utils as cr}from"vscode-uri";import{STD_SOURCES as or,BUILTIN_SOURCES as ar}from"../bundled/bundled-sources.js";var pt={...or,...ar};function ji(n){return pt[n]}function q(n){if(!ie(n))return;let t=Gt(n);return t===void 0?void 0:pt[t]}function Fi(){return Object.entries(pt)}var Be=class extends ur{constructor(t){super(t);h(this,"documentFactory");h(this,"importedModelCache",new Map);h(this,"missingImportUris",new Set);this.documentFactory=t.shared.workspace.LangiumDocumentFactory}getScope(t){let e=super.getScope(t);if(t.container.$type==="Use"&&t.property==="target"){let r=t.container.type?.ref;if(r)return this.filterByEntityType(e,r.name)}return e}filterByEntityType(t,e){let r=i=>{let s=i.node;if(!s||s.$type!=="EntityDecl")return!0;let a=s.type?.ref,o=new Set;for(;a&&!o.has(a);){if(a.name===e)return!0;o.add(a),a=a.superType?.ref}return!1};return new un([...t.getAllElements()].filter(r))}getGlobalScope(t,e){let r=cn.getContainerOfType(e.container,E);if(!r)return super.getGlobalScope(t,e);let i=new Set,s=cn.getDocument(e.container),a=s.uri.toString();for(let p of r.imports)if(p.path){let m=this.resolvePath(p.path,s.uri);m&&i.add(m)}let o=this.indexManager.allElements(t),u=[],c=[];for(let p of o){if(O(p.documentUri)){c.push(p);continue}let m=p.documentUri.toString();(m===a||i.has(m))&&u.push(p)}let l=this.getImportedDescriptions(t,r,s.uri);return new un([...u,...l,...c])}getImportedDescriptions(t,e,r){let i=[],s=new Set,a=[];for(let o of e.imports){if(!o.path)continue;let u=this.resolvePath(o.path,r);u&&a.push(ln.parse(u))}for(;a.length>0;){let o=a.shift(),u=o.toString();if(s.has(u))continue;s.add(u);let c=this.loadImportedModel(o);if(c){for(let l of c.model.declarations){let p=this.nameProvider.getName(l);p&&this.reflection.isSubtype(l.$type,t)&&i.push(this.descriptions.createDescription(l,p,c.document))}for(let l of c.model.imports){if(!l.path)continue;let p=this.resolvePath(l.path,o);p&&a.push(ln.parse(p))}}}return i}loadImportedModel(t){let e=t.toString(),r=this.importedModelCache.get(e);if(r)return r;if(this.missingImportUris.has(e))return;let i=this.readDocumentText(t);if(i!==void 0){let s=this.documentFactory.fromString(i,t),a=s.parseResult?.value;if(E(a)){let o={model:a,document:s};return this.importedModelCache.set(e,o),o}}this.missingImportUris.add(e)}readDocumentText(uri){let bundled=q(uri);if(bundled!==void 0)return bundled;if(uri.scheme==="file")try{let req=eval("require"),fs=req("fs");return fs.readFileSync(uri.fsPath,"utf-8")}catch{return}}resolvePath(t,e){let r=se(t);if(r)return r.toString();try{return cr.resolvePath(e,"..",t).toString()}catch{return}}};import{UriUtils as dt}from"langium";import{DefaultCompletionProvider as lr}from"langium/lsp";import{CompletionItemKind as fe}from"vscode-languageserver-types";import{isAstNode as pn}from"langium";function G(n,t,e=new Set){if(!e.has(n)){e.add(n),t(n);for(let r of Object.values(n))if(pn(r))G(r,t,e);else if(Array.isArray(r))for(let i of r)pn(i)&&G(i,t,e)}}function mt(n){if(n.length>=2){let t=n[0],e=n[n.length-1];if((t==='"'||t==="'")&&t===e)return n.slice(1,-1)}return n}function mn(n){let t=new Set;return G(n,e=>{d(e)&&e.name==="group"&&$(e.value)&&t.add(mt(e.value.value))}),t}function dn(n){let t=new Set;return G(n,e=>{d(e)&&e.name==="route"&&$(e.value)&&t.add(mt(e.value.value))}),t}function fn(n){let t=new Set;return G(n,e=>{St(e)&&t.add(e.unit.join("/"))}),t}function yn(n){let t=new Set;return G(n,e=>{y(e)?t.add(e.name):d(e)&&(e.name==="targets"||e.name==="conflicts"||e.name==="synergies")&&G(e.value,r=>{I(r)&&t.add(mt(r.value))})}),t}import{AstUtils as ft}from"langium";var _e=class extends lr{constructor(e){super(e);h(this,"documents");this.documents=()=>e.shared.workspace.LangiumDocuments}completionFor(e,r,i){if(r.property==="path")this.completeImportPath(e,i);else if(r.property==="route")this.completeRoutes(e,i);else if(r.property==="group")this.completeGroups(e,i);else if(r.property==="unit")this.completeUnits(e,i);else if(r.type==="ScalarAssignment"&&r.property==="name")this.completeMemberNames(e,i);else if(r.property==="value")this.completeMemberValue(e,i);else return super.completionFor(e,r,i)}completeImportPath(e,r){let s=e.textDocument.getText().substring(e.offset,e.tokenEndOffset),a=[...new Set([...this.getAllFiles(e.document),...jt()])],o={start:e.position,end:e.position};if(s.length>0){let u=s.substring(1);a=a.filter(p=>p.startsWith(u));let c=e.textDocument.positionAt(e.tokenOffset+1),l=e.textDocument.positionAt(e.tokenEndOffset-1);o={start:c,end:l}}for(let u of a){let c=s.length>0?"":'"',l=`${c}${u}${c}`;r(e,{label:u,textEdit:{newText:l,range:o},kind:fe.File,sortText:"0"})}}completeFromModel(e,r,i,s,a=o=>String(o)){let o=e.document.parseResult?.value;if(!o)return;let u=e.textDocument.getText().substring(e.tokenOffset,e.tokenEndOffset),c=i(o);c.delete(u);for(let l of c){let p=a(l);r(e,{label:p,documentation:`${s}: ${p}`,insertText:p,kind:fe.Value,sortText:"0"})}}completeRoutes(e,r){this.completeFromModel(e,r,dn,"Route of administration")}completeGroups(e,r){this.completeFromModel(e,r,mn,"Group")}completeUnits(e,r){this.completeFromModel(e,r,fn,"Unit")}completeMemberNames(e,r){let i=ft.getContainerOfType(e.node,y),s=i?.type?.ref;if(!i||!s)return;let a=U.forNode(i),o=new Set(i.assignments.flatMap(u=>u.$type==="ScalarAssignment"||u.$type==="StructAssignment"?[u.name]:[]));for(let[u,c]of S(s,a))o.has(u)||r(e,{label:u,documentation:`${pe(c.type)}${c.optional?"":" (required)"}`,insertText:`${u}: `,kind:fe.Field,sortText:c.optional?"1":"0"})}completeMemberValue(e,r){let i=ft.getContainerOfType(e.node,d),s=i&&ft.getContainerOfType(i,y),a=s?.type?.ref;if(!i||!a)return;let o=S(a,U.forNode(s)).get(i.name);if(!o)return;let u=o.type;for(;u?.$type==="ListTypeRef";)u=u.element;if(u?.$type==="EnumTypeRef"){for(let c of u.values)r(e,{label:c,documentation:`${i.name}: ${c}`,insertText:c,kind:fe.EnumMember,sortText:"0"});return}if(u?.$type==="VocabTypeRef"){let c=e.document.parseResult?.value;if(!c)return;for(let l of yn(c))r(e,{label:l,documentation:`${u.domain}: ${l}`,insertText:`"${l}"`,kind:fe.Value,sortText:"0"})}}getAllFiles(e){let r=this.documents().all,i=e.uri.toString(),s=dt.dirname(e.uri).toString(),a=[];for(let o of r)if(!dt.equals(o.uri,i)){let u=o.uri.toString(),c=u.substring(0,u.length),l=dt.relative(s,c);l.startsWith(".")||(l=`./${l}`),a.push(l)}return a}};import{AbstractSemanticTokenProvider as pr}from"langium/lsp";import{SemanticTokenTypes as g,SemanticTokenModifiers as j}from"vscode-languageserver";var Oe=class extends pr{highlightElement(t,e){if(M(t)){e({node:t,property:"name",type:g.class,modifier:[j.declaration,j.definition]}),t.superType&&e({node:t,property:"superType",type:g.class}),t.traits.forEach((r,i)=>{e({node:t,property:"traits",index:i,type:g.interface})});return}if(kt(t)){e({node:t,property:"name",type:g.property,modifier:j.declaration});return}if(te(t)){e({node:t,property:"typeName",type:K(t.typeName)?g.type:g.class,modifier:K(t.typeName)?j.defaultLibrary:[]});return}if(At(t)){e({node:t,property:"target",type:g.class});return}if(Dt(t)){e({node:t,property:"domain",type:g.namespace});return}if(xt(t)){t.values.forEach((r,i)=>{e({node:t,property:"values",index:i,type:g.enumMember})});return}if(Tt(t)){e({node:t,property:"name",type:g.decorator}),t.args.forEach((r,i)=>{r.identValue!==void 0&&e({node:t.args[i],property:"identValue",type:g.parameter})});return}if(y(t)){e({node:t,property:"type",type:g.class}),e({node:t,property:"name",type:g.variable,modifier:[j.declaration,j.readonly]}),t.superType&&e({node:t,property:"superType",type:g.variable});return}if(R(t)){e({node:t,property:"type",type:g.class}),e({node:t,property:"target",type:g.variable,modifier:j.readonly});return}if(d(t)||b(t)){e({node:t,property:"name",type:g.property});return}if($(t)){e({node:t,property:"value",type:t.value==="true"||t.value==="false"?g.keyword:g.enumMember});return}if(It(t)){e({node:t,property:"path",type:g.string});return}}};import{DefaultWorkspaceManager as mr}from"langium";function ye(n){let t=n.workspace.LangiumDocuments,e=n.workspace.LangiumDocumentFactory,r=[];for(let i of at()){let s=t.getDocument(i);if(s){r.push(s);continue}let a=q(i);if(a===void 0)continue;let o=e.fromString(a,i);t.addDocument(o),r.push(o)}return r}async function Ms(n){let t=n.workspace.LangiumDocuments;at().filter(r=>!t.hasDocument(r)).length!==0&&await n.workspace.DocumentBuilder.build(ye(n))}var Ke=class extends mr{constructor(e){super(e);h(this,"sharedServices",e)}async loadAdditionalDocuments(e,r){await super.loadAdditionalDocuments(e,r);for(let i of ye(this.sharedServices))r(i)}};import{JSDocDocumentationProvider as dr}from"langium";var Ge=class extends dr{constructor(e){super(e);h(this,"services");this.services=e}getDocumentation(e){if(d(e)||b(e)){let i=this.renderAssignmentDoc(e);if(i)return i}if(v(e)){let i=e.$container;if(i&&(d(i)||b(i))){let o=this.renderAssignmentDoc(i);if(o)return o}let s=this.renderDosing([e]);if(s)return s;let a=this.renderUserWeightRole(e);if(a)return a}let r=super.getDocumentation(e);return r?Wt(r):void 0}documentationTagRenderer(e,r){if(r.name==="evidence"){let i=Ft(r.content.toString());if(i.length>0)return i.map(s=>`- [${Se(s)}](${ae(s)})`).join(`
`)}return super.documentationTagRenderer(e,r)}renderAssignmentDoc(e){let r=[],i=this.renderEvidenceAnnotations(e.annotations);i&&r.push(i);let s=[];if(d(e))v(e.value)&&s.push(e.value);else for(let o of e.fields)d(o)&&v(o.value)&&s.push(o.value);let a=this.renderDosing(s);return a&&r.push(a),r.length>0?r.join(`

`):void 0}renderEvidenceAnnotations(e){let r=[];for(let i of e){if(i.name!=="evidence")continue;let s=i.args[0]?.stringValue;if(s===void 0)continue;let a=w(s);r.push(a?`- [${Se(a)}](${ae(a)})`:`- ${s}`)}return r.length>0?`**Evidence**
${r.join(`
`)}`:void 0}renderDosing(e){let r=De(this.services);if(!r)return;let i=[];for(let s of e){if(!ue(s.unit.unit))continue;let a=qt(s.amount,s.unit.unit,r);a&&i.push(`- ${Yt(a,s.amount)}`)}return i.length>0?`**Dynamic dose**
${i.join(`
`)}`:void 0}renderUserWeightRole(e){let r=e.$container;if(!r||!d(r)||r.name!=="weight")return;let i=r.$container;if(!(!i||!y(i)||i.type?.ref?.name!=="user"))return`**User weight** \u2014 per-kg doses resolve against this (${oe(e.amount)} ${e.unit.unit.join("/")})`}};var br=n=>({validation:{BiohackingValidator:t=>new Pe(t)},references:{ScopeProvider:t=>new Be(t)},lsp:{CompletionProvider:t=>new _e(t),SemanticTokenProvider:t=>new Oe(t)},documentation:{CommentProvider:t=>new fr(t),DocumentationProvider:t=>new Ge(t)},typir:()=>hr(n,f,new Ve)}),Rr={workspace:{WorkspaceManager:n=>new Ke(n)}};function Qs(n){let t=gn(gr(n),wt,Rr),e=gn(yr({shared:t}),Ct,br(t));return t.ServiceRegistry.register(e),an(e),$r(e,e.typir),n.connection||t.workspace.ConfigurationProvider.initialized({}),{shared:t,Biohacking:e}}import{URI as vr,UriUtils as Tr}from"langium";function xr(n,t){let e=se(n);if(e)return e;try{return Tr.resolvePath(t,"..",n)}catch{return}}async function oo(n,t,e,r,i){let s=typeof e=="string"?vr.parse(e):e,a=n.shared.workspace.LangiumDocumentFactory,o=n.shared.workspace.DocumentBuilder,u=new Map,c=[],l=a.fromString(t,s);u.set(s.toString(),l);for(let V of ye(n.shared)){let D=V.uri.toString();D===s.toString()||u.has(D)||u.set(D,V)}let p=[l];for(;p.length>0;){let V=p.shift(),D=V.parseResult?.value;if(E(D))for(let be of D.imports){if(!be.path)continue;let Z=xr(be.path,V.uri);if(!Z){c.push(be.path);continue}let $t=Z.toString();if(u.has($t))continue;let bt=q(Z)??(r?await r(Z):void 0);if(bt===void 0){c.push(be.path);continue}let Rt=a.fromString(bt,Z);u.set($t,Rt),p.push(Rt)}}await o.build([...u.values()],{validation:i?.validation??!1});let m=l.parseResult?.value;if(!E(m))throw new Error("Failed to parse .bio content");let L=[];for(let V of u.values()){if(V===l)continue;let D=V.parseResult?.value;E(D)&&L.push(D)}return{entry:m,imported:L,entryDocument:l,missingImports:c}}var uo=["pharmacokinetic","interacting","schedulable"];function co(){return{version:2,types:[],entities:[],interactions:[]}}function k(n,t){return`${n}:${t}`}function yt(n,t){let e=[],r=new Set,i=t;for(;i&&!r.has(i);)r.add(i),e.push(i),i=n.types.find(s=>s.name===i)?.extends;return e}function T(n,t,e){return yt(n,t).includes(e)}function lo(n,t){let e=new Set;for(let r of yt(n,t))n.types.find(i=>i.name===r)?.traits.forEach(i=>e.add(i));return[...e].sort()}function C(n,t){return n.entities.filter(e=>T(n,e.type,t))}function hn(n,t,e){for(let r of yt(n,t)){let i=n.types.find(s=>s.name===r)?.members.find(s=>s.name===e);if(i)return i}}function po(n,t){return n.entities.filter(e=>e.traits.includes(t))}function je(n,t){return n.traits.includes(t)}function $n(n,t){let e=n.props[t];return e?.kind==="measurement"?e.value:void 0}function bn(n,t){let e=n.props[t];if(e?.kind==="text"||e?.kind==="ident")return e.value}function mo(n,t){let e=n.props[t];return e?.kind==="number"?e.value:void 0}function F(n,t){let e=n.props[t];return e?e.kind==="text"||e.kind==="ident"?[e.value]:e.kind!=="list"?[]:e.items.flatMap(r=>r.kind==="text"||r.kind==="ident"?[r.value]:[]):[]}function Fe(n,t){let e=n.props[t];if(e?.kind==="struct")return e.fields;if(e?.kind==="measurement")return{amount:e}}function ge(n,t){let e=n?.[t];return e?.kind==="measurement"?e.value:void 0}function Rn(n){if(n.kind==="enum")return n.values;if(n.kind==="list")return Rn(n.element)}function Ir(n,t,e){for(let r of Object.keys(t.props)){let i=hn(n,t.type,r),s=i&&Rn(i.type);if(s)for(let a of F(t,r))s.includes(a)||e.push({severity:"error",path:`${t.id}.props.${r}`,message:`Unknown ${r} "${a}". Use one of: ${s.join(", ")}.`})}}function vn(n,t){t.push(n),n.children.forEach(e=>vn(e,t))}function go(n){let t=[],e=[];n.entities.forEach(c=>vn(c,e)),e.forEach(c=>Ir(n,c,t));let r=C(n,"substance"),i=C(n,"intervention"),s=C(n,"stack"),a=new Set(r.map(c=>c.name)),o=new Set(i.map(c=>c.name)),u=new Set(s.map(c=>c.name));return r.forEach(c=>{c.name.trim()||t.push({severity:"error",path:`${c.id}.name`,message:"Substance name must not be empty."})}),i.forEach(c=>{kr(n,c,t,a)}),s.forEach(c=>{c.name.trim()||t.push({severity:"error",path:`${c.id}.name`,message:"Stack name must not be empty."}),c.uses.forEach((l,p)=>{T(n,l.targetType,"intervention")&&!o.has(l.targetName)&&t.push({severity:"warning",path:`${c.id}.uses[${p}]`,message:`Unknown intervention ref "${l.targetName}".`}),T(n,l.targetType,"stack")&&!u.has(l.targetName)&&t.push({severity:"warning",path:`${c.id}.uses[${p}]`,message:`Unknown stack ref "${l.targetName}".`})})}),C(n,"protocol").forEach(c=>{Ar(n,c,t,o,u)}),t}function kr(n,t,e,r){t.name.trim()||e.push({severity:"error",path:`${t.id}.name`,message:"Intervention name must not be empty."});let i=t.uses.find(o=>T(n,o.targetType,"substance"));i&&!r.has(i.targetName)&&e.push({severity:"warning",path:`${t.id}.uses`,message:`Unknown substance ref "${i.targetName}".`}),bn(t,"time_of_day")&&t.props.frequency===void 0&&e.push({severity:"warning",path:`${t.id}.props.time_of_day`,message:"time_of_day is set but no dosing frequency is defined. Add a frequency block."});let a=ge(Fe(t,"dose"),"amount");a&&a.amount<0&&e.push({severity:"error",path:`${t.id}.props.dose.amount`,message:"Dose amount must be non-negative."})}function Ar(n,t,e,r,i){t.name.trim()||e.push({severity:"error",path:`${t.id}.name`,message:"Protocol name must not be empty."});for(let s of t.children)T(n,s.type,"phase")&&Sr(n,s,e,r,i)}function Sr(n,t,e,r,i){t.name.trim()||e.push({severity:"error",path:`${t.id}.name`,message:"Phase name must not be empty."}),t.uses.forEach((s,a)=>{T(n,s.targetType,"intervention")&&!r.has(s.targetName)&&e.push({severity:"warning",path:`${t.id}.uses[${a}]`,message:`Unknown intervention ref "${s.targetName}".`}),T(n,s.targetType,"stack")&&!i.has(s.targetName)&&e.push({severity:"warning",path:`${t.id}.uses[${a}]`,message:`Unknown stack ref "${s.targetName}".`})})}var Dr={mcg:1,\u03BCg:1,mg:1e3,g:1e6,kg:1e9,ng:.001};function Tn(n){let t=Dr[n.unit.toLowerCase()];return t===void 0?void 0:n.amount*t}function Er(n){return new Map(n.entities.map(t=>[t.id,t]))}function We(n,t,e){if(je(t,"pharmacokinetic"))return{paths:[e],name:t.name,conflicts:F(t,"conflicts")};let r=t.uses.map(i=>n.get(k(i.targetType,i.targetName))).find(i=>i!==void 0&&je(i,"pharmacokinetic"));return r?{paths:[e,r.id],name:r.name,conflicts:[...new Set([...F(r,"conflicts"),...F(t,"conflicts")])]}:{paths:[e],name:t.name,conflicts:F(t,"conflicts")}}function gt(n,t,e,r){if(r.has(e.id))return[];r.add(e.id);let i=[];for(let s of e.children)i.push(We(t,s,s.id));for(let s of e.uses){let a=t.get(k(s.targetType,s.targetName));a&&(T(n,a.type,"stack")?i.push(...gt(n,t,a,r).map(o=>({...o,origin:a.id}))):i.push(We(t,a,a.id)))}return i}function Mr(n,t,e){let r=[];for(let i of e.children)r.push(We(t,i,i.id));for(let i of e.uses){let s=t.get(k(i.targetType,i.targetName));s&&(T(n,s.type,"stack")?r.push(...gt(n,t,s,new Set).map(a=>({...a,origin:s.id}))):r.push(We(t,s,s.id)))}return r}function xn(n,t,e,r,i){for(let s=0;s<n.length;s++)for(let a=s+1;a<n.length;a++){let o=n[s],u=n[a];if(o.name.toLowerCase()===u.name.toLowerCase()||o.origin!==void 0&&o.origin===u.origin)continue;let c=[...new Set([...o.paths.slice(1),...u.paths.slice(1),o.paths[0],e])],l=i.find(o.name,u.name);l&&r.push({severity:l.severity==="critical"?"error":"warning",path:u.paths[0],relatedPaths:c,message:`${t}: ${l.message}`}),(o.conflicts.some(m=>m.toLowerCase()===u.name.toLowerCase())||u.conflicts.some(m=>m.toLowerCase()===o.name.toLowerCase()))&&r.push({severity:"error",path:u.paths[0],relatedPaths:c,message:`${t}: "${o.name}" and "${u.name}" are listed as conflicting substances. Combining them may cause dangerous interactions.`})}}function Ro(n){let t=[],e=Er(n),r=Ut(n);for(let i of C(n,"stack")){let s=gt(n,e,i,new Set);xn(s,`Stack "${i.name}"`,i.id,t,r)}for(let i of C(n,"protocol"))for(let s of i.children){if(!T(n,s.type,"phase"))continue;let a=Mr(n,e,s);xn(a,`Phase "${s.name}" (${i.name})`,s.id,t,r)}for(let i of C(n,"intervention")){let s=i.uses.map(p=>e.get(k(p.targetType,p.targetName))).find(p=>p!==void 0&&je(p,"pharmacokinetic"));if(!s)continue;let a=$n(s,"max_dose");if(!a)continue;let o=Fe(i,"dose"),u=ge(o,"amount")??ge(o,"max");if(!u)continue;let c=Tn(u),l=Tn(a);c===void 0||l===void 0||c>l&&t.push({severity:"error",path:i.id,relatedPaths:[s.id],message:`Dose exceeds maximum: ${u.amount} ${u.unit} exceeds the maximum dose of ${a.amount} ${a.unit} for "${s.name}".`})}return t}function wr(n,t){let e=r=>{t(r);for(let i of r.children)e(i)};for(let r of n)e(r)}function xo(n){let t=new Map,e=new Map,r=[];wr(n.entities,o=>{r.push(o),t.set(o.id,o),e.has(o.name)||e.set(o.name,o)});let i=new Set,s=[],a=o=>{o&&!i.has(o)&&(i.add(o),s.push(o))};for(let o of r)(o.origin===void 0||o.origin==="entry")&&a(o);for(;s.length>0;){let o=s.shift();for(let u of o.children)a(u);o.extends&&a(e.get(o.extends)??t.get(k(o.type,o.extends)));for(let u of o.uses)a(t.get(k(u.targetType,u.targetName))??e.get(u.targetName))}for(let o of n.interactions){let[u,c]=o.entities,l=e.get(u),p=e.get(c);!l||!p||(i.has(l)&&!i.has(p)&&i.add(p),i.has(p)&&!i.has(l)&&i.add(l))}return r.filter(o=>i.has(o))}function Cr(n){return{kind:"measurement",value:{amount:n.amount,unit:n.unit.unit.join("/")}}}function he(n){return n.length>=6&&n.startsWith("'''")&&n.endsWith("'''")?n.slice(3,-3):n.length>=2&&(n.startsWith('"')&&n.endsWith('"')||n.startsWith("'")&&n.endsWith("'"))?n.slice(1,-1):n}function $e(n){return v(n)?Cr(n):ne(n)?{kind:"number",value:n.value}:I(n)?{kind:"text",value:he(n.value)}:ee(n)?{kind:"list",items:n.items.map($e)}:{kind:"ident",value:n.value}}function An(n){return n.map(t=>({name:t.name,args:t.args.map(e=>e.stringValue!==void 0?he(e.stringValue):e.identValue!==void 0?e.identValue:e.numberValue).filter(e=>e!==void 0)}))}function Sn(n){switch(n.$type){case"ListTypeRef":return{kind:"list",element:Sn(n.element)};case"EnumTypeRef":return{kind:"enum",values:[...n.values]};case"VocabTypeRef":return{kind:"vocab",domain:n.domain};case"RefTypeRef":return{kind:"ref",target:n.target.$refText};default:return{kind:"named",name:n.typeName}}}function Vr(n){return{name:n.name,optional:n.optional===!0,type:Sn(n.type),default:n.default?$e(n.default):void 0,annotations:An(n.annotations)}}function Nr(n){return{name:n.name,extends:n.superType?.$refText||void 0,traits:[...n.traits],members:n.members.map(Vr),annotations:An(n.annotations)}}function Ur(n,t){let e=new Set,r=new Set,i=n;for(;i&&!r.has(i);){r.add(i);let s=t.get(i);if(!s)break;for(let a of s.traits)e.add(a);i=s.extends}return[...e].sort()}function Lr(n,t){let e={};for(let r of n.overrides)d(r)?e[r.name]=$e(r.value):b(r)&&(e[r.name]=ht(r));return{targetType:n.type.$refText,targetName:he(n.target.$refText),overrides:e,order:t}}function ht(n){let t={};for(let e of n.fields)d(e)?t[e.name]=$e(e.value):b(e)&&(t[e.name]=ht(e));return{kind:"struct",fields:t}}function Dn(n,t,e=0,r="entry"){let i={},s=[],a=[],o={};n.assignments.forEach((l,p)=>{if(d(l)){i[l.name]=$e(l.value);let m=In(l);m.length>0&&(o[l.name]=m)}else if(b(l)){i[l.name]=ht(l);let m=In(l);m.length>0&&(o[l.name]=m)}else y(l)?s.push(Dn(l,t,p,r)):R(l)&&a.push(Lr(l,p))});let u=n.type.$refText,c=he(n.name);return{id:k(u,c),type:u,name:c,extends:n.superType?.$refText?he(n.superType.$refText):void 0,traits:Ur(u,t),props:i,...Object.keys(o).length>0?{evidence:o}:{},children:s,uses:a,order:e,origin:r}}function In(n){let t=[];for(let e of n.annotations){if(e.name!=="evidence")continue;let r=e.args[0]?.stringValue;if(r===void 0)continue;let i=w(r);i&&t.push(i)}return t}function Pr(n,t,e){let r={...n};for(let[i,s]of Object.entries(t)){let a=n[i];if(e.has(i)&&a?.kind==="text"&&s.kind==="text"){r[i]={kind:"text",value:`${a.value}
${s.value}`};continue}if(a?.kind==="list"&&s.kind==="list"){let o=new Set,u=[];for(let c of[...a.items,...s.items]){let l=c.kind==="text"||c.kind==="ident"?c.value:JSON.stringify(c);o.has(l)||(o.add(l),u.push(c))}r[i]={kind:"list",items:u}}else r[i]=s}return r}function Br(n,t){let e=new Set,r=new Set,i=n;for(;i&&!r.has(i);){r.add(i);let s=t.get(i);if(!s)break;for(let a of s.members)a.annotations.find(u=>u.name==="inherit")?.args.includes("concat")&&e.add(a.name);i=s.extends}return e}function _r(n,t){let e=new Map(n.map(s=>[s.id,s])),r=new Set,i=(s,a)=>{if(!r.has(s.id)){if(a.has(s.id)){r.add(s.id);return}if(a.add(s.id),s.extends){let o=e.get(k(s.type,s.extends))??n.find(u=>u.name===s.extends);o&&(i(o,a),s.props=Pr(o.props,s.props,Br(s.type,t)))}r.add(s.id)}};for(let s of n)i(s,new Set)}var kn=["synergies","conflicts"];function Or(n){let t=n.filter(i=>i.traits.includes("interacting")),e=new Map(t.map(i=>[i.name,i])),r=(i,s)=>{let a=i.props[s];return a?.kind==="list"?a.items.flatMap(o=>o.kind==="text"||o.kind==="ident"?[o.value]:[]):a?.kind==="text"||a?.kind==="ident"?[a.value]:[]};for(let i of t)for(let s of kn)for(let a of r(i,s)){let o=e.get(a);if(!o||o===i)continue;let u=r(o,s);u.includes(i.name)||(o.props[s]={kind:"list",items:[...u,i.name].map(c=>({kind:"text",value:c}))})}for(let i of t)for(let s of kn){if(!i.props[s])continue;let a=[...new Set(r(i,s))].sort();i.props[s]={kind:"list",items:a.map(o=>({kind:"text",value:o}))}}}function Kr(n,t){let e=Gr(n);if(!e)return;let r=[e.a,e.b].sort();return{id:t,relType:"negative",entities:r,weight:Nt(e.severity),note:e.message,source:n.name}}function Gr(n){let t=a=>{let o=n.props[a];return o?.kind==="text"||o?.kind==="ident"?o.value:void 0},e=t("a"),r=t("b"),i=t("message"),s=t("severity");if(!(!e||!r||!i||!s)&&!(s!=="critical"&&s!=="high"&&s!=="moderate"))return{name:n.name,a:e,b:r,severity:s,message:i}}function jr(n,t,e){let r=new Set,i=n;for(;i&&!r.has(i);){if(i===t)return!0;r.add(i),i=e.get(i)?.extends}return!1}function En(n){let t=new Set,e=[],r=0,i=(s,a,o,u)=>{let c=[s,a].sort(),l=`${c[0]}|${c[1]}|${o}`;t.has(l)||(t.add(l),e.push({id:`ix-${r++}`,relType:o,entities:c,source:u}))};for(let s of n){if(!s.traits.includes("interacting"))continue;let a=`${s.type} ${s.name}`;for(let[o,u]of[["synergies","positive"],["conflicts","negative"]]){let c=s.props[o];if(c?.kind==="list")for(let l of c.items)(l.kind==="text"||l.kind==="ident")&&i(s.name,l.value,u,a)}}return e}function Mn(n,t){let e=i=>`${i.entities[0]}|${i.entities[1]}|${i.relType}`,r=new Set(n.map(e));return[...n,...t.filter(i=>!r.has(e(i)))]}function Fr(n){let t=[],e=i=>{t.push(i),i.children.forEach(e)};n.entities.forEach(e);let r=n.interactions.filter(rt);return{...n,interactions:Mn(r,En(t))}}var Wr=new Set(["protocol"]);function zr(n,t=[]){let e=new Map,r=[],i=(c,l)=>{for(let p of c.declarations)M(p)?(l||!e.has(p.name))&&e.set(p.name,Nr(p)):y(p)&&r.push({decl:p,isEntry:l})};i(n,!0);for(let c of t)i(c,!1);let s=[],a=[],o=new Set,u=new Set;for(let{decl:c,isEntry:l}of r){let p=Dn(c,e,0,l?"entry":"import");if(jr(p.type,ke,e)){let m=Kr(p,`ix-cat-${a.length}`);if(m){let L=m.entities.join("|");u.has(L)||(u.add(L),a.push(m))}continue}if(!(!l&&Wr.has(p.type))&&!(!l&&o.has(p.id))){if(l&&o.has(p.id)){let m=s.findIndex(L=>L.id===p.id);m>=0&&(s[m]=p);continue}o.add(p.id),s.push(p)}}return _r(s,e),Or(s),{version:2,types:[...e.values()],entities:s,interactions:Mn(a,En(s))}}var wn={$comment:"HAND-WRITTEN. Not generated by langium-cli \u2014 the `textMate` block was removed from langium-config.json on purpose. The generated grammar only knew the keyword list, which for a self-describing DSL is almost nothing: `substance`, `dose` and `half_life` are ordinary identifiers, so everything except `type`/`use`/`import` came out unstyled. This grammar styles by SHAPE instead (ident + string = an entity, ident + colon = a property, number + unit = a measurement) and nests type bodies separately from entity bodies so `half_life: Measurement` and `half_life: 5 h` colour their right-hand sides differently. Precise, metamodel-aware colouring is layered on top by the semantic token provider in src/biohacking-semantic-tokens.ts; this file is what the editor falls back to before the language server has answered. NOTE: inside the Theia app that layering never happens \u2014 monaco's StandaloneThemeService hardcodes `semanticHighlighting = false` and Theia never flips it, so this grammar is the ONLY colouring layer there. Scopes must therefore be self-sufficient, and the colours for them live in extensions/biohacking-theme/themes/*.json.",name:"biohacking",scopeName:"source.biohacking",fileTypes:["bio"],patterns:[{include:"#comments"},{include:"#import"},{include:"#type-declaration"},{include:"#entity-declaration"},{include:"#annotation"}],repository:{comments:{patterns:[{name:"comment.block.documentation.biohacking",begin:"/\\*\\*(?!/)",beginCaptures:{"0":{name:"punctuation.definition.comment.biohacking"}},end:"\\*/",endCaptures:{"0":{name:"punctuation.definition.comment.biohacking"}}},{name:"comment.block.biohacking",begin:"/\\*",beginCaptures:{"0":{name:"punctuation.definition.comment.biohacking"}},end:"\\*/",endCaptures:{"0":{name:"punctuation.definition.comment.biohacking"}}},{name:"comment.line.double-slash.biohacking",begin:"//",beginCaptures:{"0":{name:"punctuation.definition.comment.biohacking"}},end:"(?=$)"}]},import:{name:"meta.import.biohacking",match:`\\b(import)\\s+(("(?:\\\\.|[^"\\\\])*")|('(?:\\\\.|[^'\\\\])*'))`,captures:{"1":{name:"keyword.control.import.biohacking"},"2":{name:"string.quoted.biohacking"}}},annotation:{name:"meta.annotation.biohacking",begin:"(@)([A-Za-z_]\\w*)",beginCaptures:{"1":{name:"punctuation.definition.annotation.biohacking"},"2":{name:"entity.name.function.decorator.biohacking"}},end:"(?<=\\))|(?!\\()",patterns:[{begin:"\\(",beginCaptures:{"0":{name:"punctuation.definition.arguments.begin.biohacking"}},end:"\\)",endCaptures:{"0":{name:"punctuation.definition.arguments.end.biohacking"}},patterns:[{include:"#strings"},{include:"#numbers"},{name:"punctuation.separator.comma.biohacking",match:","},{name:"variable.parameter.annotation.biohacking",match:"\\b[A-Za-z_]\\w*\\b"}]}]},strings:{patterns:[{$comment:"MULTISTRING must come first \u2014 a single-quote rule would otherwise open on the first ' of ''' and close on the second, leaving the body unstyled.",name:"string.quoted.triple.biohacking",begin:"'''",beginCaptures:{"0":{name:"punctuation.definition.string.begin.biohacking"}},end:"'''",endCaptures:{"0":{name:"punctuation.definition.string.end.biohacking"}}},{name:"string.quoted.double.biohacking",begin:'"',beginCaptures:{"0":{name:"punctuation.definition.string.begin.biohacking"}},end:'"',endCaptures:{"0":{name:"punctuation.definition.string.end.biohacking"}},patterns:[{include:"#string-character-escape"}]},{name:"string.quoted.single.biohacking",begin:"'",beginCaptures:{"0":{name:"punctuation.definition.string.begin.biohacking"}},end:"'",endCaptures:{"0":{name:"punctuation.definition.string.end.biohacking"}},patterns:[{include:"#string-character-escape"}]}]},"string-character-escape":{name:"constant.character.escape.biohacking",match:"\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|u\\{[0-9A-Fa-f]+\\}|[0-2][0-7]{0,2}|3[0-6][0-7]?|37[0-7]?|[4-7][0-7]?|.|$)"},numbers:{patterns:[{$comment:"Mirrors the MEASURED_NUMBER terminal: a unit only binds to a number on the SAME line, which is why the gap is [ \\t] and not \\s.",name:"meta.measurement.biohacking",match:"\\b(\\d+(?:\\.\\d+)?)([ \\t]*)([A-Za-z\u03BC]\\w*(?:[ \\t]*/[ \\t]*[A-Za-z\u03BC]\\w*)*)",captures:{"1":{name:"constant.numeric.biohacking"},"3":{name:"keyword.other.unit.biohacking"}}},{name:"constant.numeric.biohacking",match:"\\b\\d+(?:\\.\\d+)?\\b"}]},"type-reference":{$comment:"The right-hand side of a member declaration: `Ref<substance>`, `[Vocab<pathway>]`, `oneof(a, b)` or a plain type name.",patterns:[{match:"\\b(Ref|Vocab)\\s*(<)\\s*([A-Za-z_]\\w*)\\s*(>)",captures:{"1":{name:"support.type.builtin.biohacking"},"2":{name:"punctuation.definition.typeparameters.begin.biohacking"},"3":{name:"entity.name.type.biohacking"},"4":{name:"punctuation.definition.typeparameters.end.biohacking"}}},{begin:"\\b(oneof)\\s*(\\()",beginCaptures:{"1":{name:"support.type.builtin.biohacking"},"2":{name:"punctuation.definition.parameters.begin.biohacking"}},end:"\\)",endCaptures:{"0":{name:"punctuation.definition.parameters.end.biohacking"}},patterns:[{name:"punctuation.separator.comma.biohacking",match:","},{name:"constant.other.enum.biohacking",match:"\\b[A-Za-z_]\\w*\\b"}]},{name:"support.type.primitive.biohacking",match:"\\b(Number|String|Text|Bool|Ident|Measurement)\\b"},{name:"punctuation.definition.list.biohacking",match:"[\\[\\]]"},{name:"entity.name.type.biohacking",match:"\\b[A-Za-z_]\\w*\\b"}]},values:{$comment:"The right-hand side of an assignment inside an entity body.",patterns:[{include:"#comments"},{include:"#strings"},{include:"#numbers"},{name:"constant.language.boolean.biohacking",match:"\\b(true|false)\\b"},{name:"punctuation.definition.list.biohacking",match:"[\\[\\]]"},{name:"punctuation.separator.comma.biohacking",match:","},{$comment:"A bare identifier used as a value, e.g. `route: subcutaneous` or `status: active`.",name:"constant.other.biohacking",match:"\\b[A-Za-z_]\\w*\\b"}]},"type-declaration":{name:"meta.type.declaration.biohacking",begin:"\\b(type)\\s+([A-Za-z_]\\w*)",beginCaptures:{"1":{name:"storage.type.biohacking"},"2":{name:"entity.name.type.declaration.biohacking"}},end:"(?<=\\})",patterns:[{include:"#comments"},{match:"\\b(extends)\\s+([A-Za-z_]\\w*)",captures:{"1":{name:"keyword.control.extends.biohacking"},"2":{name:"entity.other.inherited-class.biohacking"}}},{$comment:"`is pharmacokinetic, interacting` \u2014 the trait list runs to the end of the line or to the first annotation/brace.",begin:"\\b(is)\\b",beginCaptures:{"1":{name:"keyword.control.traits.biohacking"}},end:"(?=[@{])|(?=$)",patterns:[{name:"punctuation.separator.comma.biohacking",match:","},{name:"entity.other.attribute-name.trait.biohacking",match:"\\b[A-Za-z_]\\w*\\b"}]},{include:"#annotation"},{include:"#type-body"}]},"type-body":{begin:"\\{",beginCaptures:{"0":{name:"punctuation.definition.block.begin.biohacking"}},end:"\\}",endCaptures:{"0":{name:"punctuation.definition.block.end.biohacking"}},patterns:[{include:"#comments"},{include:"#member-declaration"},{include:"#annotation"}]},"member-declaration":{$comment:"`half_life?: Measurement = 5 h @widget(slider)` \u2014 scoped as a line-bounded region so the default value and the type reference get different colours.",name:"meta.member.declaration.biohacking",begin:"\\b([A-Za-z_]\\w*)\\s*(\\?)?\\s*(:)",beginCaptures:{"1":{name:"variable.other.member.declaration.biohacking"},"2":{name:"keyword.operator.optional.biohacking"},"3":{name:"punctuation.separator.key-value.biohacking"}},end:"(?=$)|(?=\\})",patterns:[{include:"#comments"},{$comment:"`= active` \u2014 a member default is a VALUE, not a type name.",begin:"(=)",beginCaptures:{"1":{name:"keyword.operator.assignment.biohacking"}},end:"(?=$)|(?=@)|(?=\\})",patterns:[{include:"#values"}]},{include:"#annotation"},{include:"#type-reference"}]},"entity-declaration":{$comment:'`intervention "Ipamorelin" { ... }` \u2014 the leading identifier is a type name resolved against core.bio, which TextMate cannot know, so it is scoped by position.',name:"meta.entity.declaration.biohacking",begin:`\\b([A-Za-z_]\\w*)[ \\t]+(?=["'])`,beginCaptures:{"1":{name:"support.class.entity-type.biohacking"}},end:"(?<=\\})",patterns:[{include:"#comments"},{$comment:'`extends "Base Peptide"` \u2014 the target is a string ID naming another entity, so it takes the entity-identity scope rather than `entity.other.inherited-class`, which in this grammar means a TYPE name (see #type-declaration) and is themed like a string.',match:`\\b(extends)\\s+(("(?:\\\\.|[^"\\\\])*")|('(?:\\\\.|[^'\\\\])*'))`,captures:{"1":{name:"keyword.control.extends.biohacking"},"2":{name:"entity.name.section.reference.biohacking"}}},{$comment:'The entity\'s own quoted ID. Kept out of the `string.*` family on purpose \u2014 it is an identifier, not free text, and must not read the same as `goal: "Enhance GH pulsatility"` one line below it.',name:"entity.name.section.biohacking",match:`("(?:\\\\.|[^"\\\\])*")|('(?:\\\\.|[^'\\\\])*')`},{include:"#entity-body"}]},"entity-body":{begin:"\\{",beginCaptures:{"0":{name:"punctuation.definition.block.begin.biohacking"}},end:"\\}",endCaptures:{"0":{name:"punctuation.definition.block.end.biohacking"}},patterns:[{include:"#comments"},{include:"#use"},{$comment:"`dose { min: 5 mg }` \u2014 a struct-valued property. Must precede #entity-declaration, which would otherwise not match anyway, and #values, which would score it as a bare identifier.",begin:"\\b([A-Za-z_]\\w*)[ \\t]*(?=\\{)",beginCaptures:{"1":{name:"variable.other.property.biohacking"}},end:"(?<=\\})",patterns:[{include:"#entity-body"}]},{include:"#entity-declaration"},{name:"meta.assignment.biohacking",match:"\\b([A-Za-z_]\\w*)[ \\t]*(:)",captures:{"1":{name:"variable.other.property.biohacking"},"2":{name:"punctuation.separator.key-value.biohacking"}}},{include:"#annotation"},{include:"#values"}]},use:{$comment:'`use substance "Caffeine" { dose: 200 mg }` \u2014 matched before #entity-declaration so the type name after `use` is not mistaken for an entity declaration.',name:"meta.use.biohacking",begin:`\\b(use)[ \\t]+([A-Za-z_]\\w*)[ \\t]+(("(?:\\\\.|[^"\\\\])*")|('(?:\\\\.|[^'\\\\])*'))`,beginCaptures:{"1":{name:"keyword.control.use.biohacking"},"2":{name:"support.class.entity-type.biohacking"},"3":{name:"entity.name.section.reference.biohacking"}},end:"(?<=\\})|(?![ \\t]*\\{)",patterns:[{include:"#entity-body"}]}}};var na=JSON.stringify(wn);export{Re as Annotation,Y as AnnotationArg,W as Assignment,Ae as BUILTIN_IMPORT_PREFIX,ot as BUILTIN_SCHEME,Ot as BUNDLED_SCHEME,Q as BiohackingAstReflection,Ge as BiohackingDocumentationProvider,Ct as BiohackingGeneratedModule,wt as BiohackingGeneratedSharedModule,Mt as BiohackingGrammar,Un as BiohackingLanguageMetaData,Oe as BiohackingSemanticTokenProvider,Rr as BiohackingSharedModule,Yr as BiohackingTerminals,Ve as BiohackingTypeSystem,Pe as BiohackingValidator,Ke as BiohackingWorkspaceManager,ve as Declaration,N as EntityDecl,ze as EnumTypeRef,ke as INTERACTION_TYPE,qe as IdentValue,Ze as Import,re as InteractionCatalog,uo as KNOWN_TRAITS,Ye as ListTypeRef,He as ListValue,Te as Measurement,P as MemberDecl,xe as Model,Je as NamedTypeRef,Xe as NumberValue,Qe as RefTypeRef,_t as STD_IMPORT_PREFIX,H as ScalarAssignment,J as StructAssignment,et as TextValue,x as TypeDecl,B as TypeRef,tt as Unit,X as Use,_ as Value,nt as VocabTypeRef,Fi as allBundledSources,zr as astToIR,Gt as bundledUriToSpecifier,Ut as catalogFromIR,yn as collectConflictSynergyCandidates,mn as collectGroups,Zt as collectMeasurements,dn as collectRoutes,fn as collectUnits,br as createBiohackingModule,Qs as createBiohackingServices,ye as createBuiltinDocuments,pe as describeTypeRef,co as emptyIR,C as entitiesOfType,po as entitiesWithTrait,Mi as entityDeclsOf,k as entityId,Kn as entriesFromIR,it as entriesFromModel,_n as entryFromDecl,Se as evidenceDisplay,ae as evidenceUrl,De as findUserWeight,oe as formatNumber,Yt as formatResolution,q as getBundledSource,ji as getBundledSourceBySpecifier,na as grammarSource,je as hasTrait,Tt as isAnnotation,Hr as isAnnotationArg,Jr as isAssignment,yi as isBuiltinImportPath,O as isBuiltinUri,Gn as isBundledImportPath,ie as isBundledUri,rt as isCatalogInteraction,Xr as isDeclaration,y as isEntityDecl,xt as isEnumTypeRef,$ as isIdentValue,It as isImport,Qr as isListTypeRef,ee as isListValue,v as isMeasurement,kt as isMemberDecl,E as isModel,te as isNamedTypeRef,ne as isNumberValue,At as isRefTypeRef,d as isScalarAssignment,fi as isStdImportPath,b as isStructAssignment,T as isSubtypeOf,I as isTextValue,M as isTypeDecl,ei as isTypeRef,St as isUnit,R as isUse,ti as isValue,Dt as isVocabTypeRef,Wt as linkifyEvidenceMarkdown,jn as listBuiltinSpecifiers,at as listBuiltinUris,gi as listBundledSpecifiers,jt as listStdImportSpecifiers,Ms as loadBuiltinLibrary,$n as measurementProp,hn as memberOf,mo as numberProp,oo as parseBioWithImports,Ft as parseEvidenceList,w as parseEvidenceRef,ue as perKgDenominator,f as reflection,an as registerValidationChecks,xr as resolveImportUri,qt as resolvePerKg,se as resolveStdImportUri,xo as selectVisibleEntities,Nt as severityToWeight,F as stringListProp,ge as structMeasurement,Fe as structProp,bn as textProp,lo as traitsOfType,yt as typeChain,Ei as typeDeclsOf,lt as typirOwns,go as validateIR,Ro as validateIRSemantics,Fr as withInteractions};
