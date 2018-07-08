
import optimizeGraph, { nounify, evalGraph } from './optimizeGraph';
import testGraph from '../testGraph';
import {getNounResolvers} from "../nouns";
// import evalGraph from "./evalGraph";

describe('nounify', () => {
  it('should return constants', () => {
    const values = nounify([0], [{ noun: 'default', value: 4 }], getNounResolvers(), []);

    expect(values).toEqual([4]);
  });

  it('should return variable injections', () => {
    const values = nounify([0], [{ noun: 'default', constant: false }], getNounResolvers(), [4]);
    expect(values).toEqual([4]);

    const values2 = nounify([0], [{ noun: 'default' }], getNounResolvers(), [4]);
    expect(values2).toEqual([4]);
  });

  it('more stuff', () => {
    const values = nounify([2], [
        { noun: 'default', constant: true, value: 1 },
        { noun: 'default', constant: true, value: 2 },
        { noun: 'default' },
    ], getNounResolvers(), [4]);

    expect(values).toEqual([4]);
  })
});

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

describe('graph optimization and evaluation', () => {
  test('optimizeGraph', () => {
    expect(optimizeGraph(testGraph).graph.nodes[2].value).toBeCloseTo(3, 2);
  });
});
