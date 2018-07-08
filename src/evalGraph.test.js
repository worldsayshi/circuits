
import evalGraph from './evalGraph';
import testGraph from './testGraph';

describe('graph optimization and evaluation', () => {
  test.only('evalGraph', () => {
    // expect(pullGraph({
    //   nodes: [
    //     { type: 'Component', verb: 'plus' },
    //     { type: 'Var', value: 1 },
    //   ],
    //   links: [
    //     { target: }
    //   ]
    // }), ).toBe();
    console.log('evalGraph(testGraph)', evalGraph(testGraph));
    expect(evalGraph(testGraph)[0]).toBeCloseTo(3, 2);
  });
});
