export const EXPRESSION_TYPE = 'expression';

export function* expressionIdGenerator() {
  let value = 0;
  while (true) {
    value += 1;
    yield `expression-${value}`;
  }
}
export function* treeIdGenerator() {
  let value = 0;
  while (true) {
    value += 1;
    yield `tree-${value}`;
  }
}

export const eventFactory = (value = {}, valid = true, handled = false) => ({
  handled,
  valid,
  value,
});

export const validateExpressionState = (listOperators, opr, value, key) => {
  const hasValue = listOperators.some((listOpr) => listOpr === opr)
    ? Array.isArray(value) && value.filter((el) => el.length > 0).length !== 0
    : value !== '';
  const hasOperator = opr !== '';
  const hasKey = key !== '';
  return hasValue && hasOperator && hasKey;
};

export const ExpressionIds = expressionIdGenerator();
export const TreeIds = treeIdGenerator();
