
import evalGraph from './evalGraph';
import testGraph from './testGraph';

test('evalGraph', () => {
  // expect(pullGraph({
  //   nodes: [
  //     { type: 'Component', verb: 'plus' },
  //     { type: 'Var', value: 1 },
  //   ],
  //   links: [
  //     { target: }
  //   ]
  // }), ).toBe();
  expect(evalGraph(testGraph)).toBe([3]);
});
