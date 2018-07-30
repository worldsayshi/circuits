import * as math from 'mathjs';

const expectedMathJsRepresentation = {
  "args": [{
    "mathjs": "SymbolNode",
    "name": "x"
  }, {
    "args": [{"mathjs": "ConstantNode", "value": 2}, {"mathjs": "SymbolNode", "name": "x"}],
    "fn": "multiply",
    "implicit": true,
    "mathjs": "OperatorNode",
    "op": "*"
  }], "fn": "add", "implicit": false, "mathjs": "OperatorNode", "op": "+"
};

describe('Testing howo to work with math expressions that can then be interpreted', () => {
  it('can parse math expressions', () => {
    const expr = math.parse('x + 2x');
    expect(JSON.parse(JSON.stringify(expr))).toEqual(expectedMathJsRepresentation);
  });

  it('can evaluate math expressions', () => {
    const expr = math.parse('x + 2x');
    const scope = {x: 4};
    expect(expr.compile().eval(scope)).toEqual(12);
    expect(expr.compile().eval(scope)).toEqual(math.eval('x + 2x', scope));
  });

  it('can handle vectorized variables', () => {

    // Index is one based, wow.
    expect(math.eval('x[1] + x[2]', {x: [3, 2]})).toEqual(5);
  });

  it('can handle negative values', () => {

    // Index is one based, wow.
    expect(math.eval('-1 + - 3')).toEqual(-4);
  });
});