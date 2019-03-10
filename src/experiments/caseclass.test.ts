

type Expr = Mul | Plus;
type ExprKind = 'mul' | 'plus';

class Plus {
  kind: ExprKind = 'plus';
  constructor(
    public a: Expr | number,
    public b: Expr | number
  ){}
}

class Mul {
  kind: ExprKind = 'mul';
  constructor(
    public a: Expr | number,
    public b: Expr | number
  ){}
}

function evl(exp: Expr | number): number {
  if (typeof exp === 'number') return exp;
  switch (exp.kind) {
    case 'plus': {
      return evl(exp.a) + evl(exp.b);
    }
    case 'mul': {
      return evl(exp.a) * evl(exp.b);
    }
  }
  throw new Error('Non exhaustive: '+ JSON.stringify(exp));
}

describe('Can build AST', () => {
  it('evaluate', () => {
    expect(evl(new Mul(4,4))).toEqual(16);
    expect(evl(new Plus(new Mul(4,5), 3))).toEqual(23);
  });
});