
import evalGraph from './evalGraph';
import testGraph from '../testGraph';

describe('sum ops', () => {
  test('evalGraph', () => {
    expect(testGraph.verbs.sum([5,6], [11])).toBe(0);
    expect(testGraph.verbs.sum([11], [6,5])).toBe(0);
    expect(testGraph.verbs.sum([11, 69], [80])).toBe(0);
    expect(testGraph.verbs.sum([-20], [-30,10])).toBe(0);
    expect(evalGraph(testGraph, [4])).toBe(-1);
    expect(evalGraph(testGraph, [3])).toBe(0);
    expect(evalGraph(testGraph, [2])).toBe(1);
    expect(evalGraph(testGraph, [1])).toBe(2);
  });
});
