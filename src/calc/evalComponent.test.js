
import evalComponent from './evalComponent';
import testGraph from '../testGraph';

describe('sum ops', () => {
  test('evalComponent', () => {
    expect(testGraph.verbs.sum([5,6], [11])).toBe(0);
    expect(testGraph.verbs.sum([11], [6,5])).toBe(0);
    expect(testGraph.verbs.sum([11, 69], [80])).toBe(0);
    expect(testGraph.verbs.sum([-20], [-30,10])).toBe(0);
    expect(evalComponent(testGraph, [4])).toBe(-1);
    expect(evalComponent(testGraph, [3])).toBe(0);
    expect(evalComponent(testGraph, [2])).toBe(1);
    expect(evalComponent(testGraph, [1])).toBe(2);
  });
});
