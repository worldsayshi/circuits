
import evalGraph from './evalGraph';
import testGraph from '../testGraph';

describe('sum ops', () => {
  test('evalGraph', () => {
    expect(testGraph.verbs.sum([5,6], [11])).toBe(0);
    expect(testGraph.verbs.sum([11], [6,5])).toBe(0);
    expect(testGraph.verbs.sum([11, 69], [80])).toBe(0);
    expect(testGraph.verbs.sum([-20], [-30,10])).toBe(0);
    expect(evalGraph(testGraph, [4]).nodes[2].value).toBe(-1);
    expect(evalGraph(testGraph, [3]).nodes[2].value).toBe(0);
    expect(evalGraph(testGraph, [2]).nodes[2].value).toBe(1);
    expect(evalGraph(testGraph, [1]).nodes[2].value).toBe(2);
  });
});
