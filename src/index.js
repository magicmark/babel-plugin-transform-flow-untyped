import * as t from "babel-types";

const identifiers = {};

const getTypeAnnotation = (node: any, expectedTypes: any[]) => {
  // TODO: enforce expectedTypes

  if (t.isStringLiteral(node)) {
    return t.stringTypeAnnotation();
  }

  if (t.isNumericLiteral(node)) {
    return t.numberTypeAnnotation();
  }

  if (t.isBooleanLiteral(node)) {
    return t.booleanTypeAnnotation();
  }

  if (t.isArrowFunctionExpression(node)) {
    // make sure arguments are typed
    node.params.forEach(param => {
      if (!param.typeAnnotation) {
        param.typeAnnotation = t.typeAnnotation(t.anyTypeAnnotation());
      }
    });

    // make sure returnType exists
    if (!node.returnType) {
      const bodyRetType = getTypeAnnotation(node.body);
      node.returnType = t.typeAnnotation(bodyRetType);
    }

    // todo: construct new annotion type :/
    return t.functionTypeAnnotation(
      null,
      //t.typeParameterDeclaration([t.typeParameter(t.booleanTypeAnnotation())]),
      // todo: copy typeAnnotation
      node.params.map(p => p.typeAnnotation.typeAnnotation),
      //[t.booleanTypeAnnotation()],
      null,
      node.returnType.typeAnnotation
    );
  }

  if (t.isBlockStatement(node)) {
    const returnStatement = node.body.filter(n => t.isReturnStatement(n))[0];
    if (returnStatement) {
      return getTypeAnnotation(returnStatement.argument);
    } else {
      return t.voidTypeAnnotation();
    }
  }

  if (t.isCallExpression(node)) {
    return identifiers[node.callee.name].typeAnnotation.typeAnnotation
      .returnType;
  }

  console.log(node);
  throw "Cannot get type annotation for node!";
};

const typeArrowFunctionExpression = node => {
  if (!node.returnType) {
    const bodyRetType = getTypeAnnotation(node.body);
    node.returnType = t.typeAnnotation(bodyRetType);
  }
};

export default babel => {
  const { types: t } = babel;

  return {
    visitor: {
      ArrowFunctionExpression(path) {
        getTypeAnnotation(path.node, [t.isArrowFunctionExpression]);
      },
      VariableDeclaration(path) {
        path.node.declarations.forEach(declaration => {
          if (!declaration.id.typeAnnotation) {
            console.log(declaration);
            const initType = getTypeAnnotation(declaration.init);
            declaration.id.typeAnnotation = t.typeAnnotation(initType);
          }

          identifiers[declaration.id.name] = declaration.id;
        });
      }
    }
  };
};
