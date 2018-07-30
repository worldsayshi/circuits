
import optimizeGraph, { evalGraph, lookup } from './optimizeGraph';
import testGraph from '../testGraph';
import testGraph2 from '../testGraph2';
import {getNounResolvers} from "../nouns";
import nounify from "../nouns/nounify";
import * as math from 'mathjs';
// import evalGraph from "./evalGraph";

describe('nounify', () => {
  it('should return constants', () => {
    const values = nounify([{ noun: 'default', value: 4, constant: true }], getNounResolvers());

    expect(values).toEqual([4]);
  });

  it('should return variable injections', () => {
    const exprs = nounify([{ noun: 'default', constant: false }], getNounResolvers());
    expect(exprs.map(expr => math.eval(expr, {x:[4]}))).toEqual([4]);

    const exprs2 = nounify([{ noun: 'default' }], getNounResolvers());
    expect(exprs.map(expr => math.eval(expr, {x:[4]}))).toEqual([4]);
  });

  it('more stuff', () => {
    const exprs = nounify(lookup([2], [
        { noun: 'default', constant: true, value: 1 },
        { noun: 'default', constant: true, value: 2 },
        { noun: 'default' },
    ]), getNounResolvers());

    expect(exprs.map(expr => math.eval(expr, {x:[4]}))).toEqual([4]);
  })
});

describe('sum ops', () => {
  it('should evaluate simple graph', () => {
    expect(testGraph.verbs.sum([5,6], [11])).toBe('5 + 6 - (11)');
    expect(testGraph.verbs.sum([11], [6,5])).toBe('11 - (6 + 5)');
    expect(testGraph.verbs.sum([11, 69], [80])).toBe('11 + 69 - (80)');
    expect(testGraph.verbs.sum([-20], [-30,10])).toBe('-20 - (-30 + 10)');
    expect(evalGraph(testGraph, [4])).toBe(-1);
    expect(evalGraph(testGraph, [3])).toBe(0);
    expect(evalGraph(testGraph, [2])).toBe(1);
    expect(evalGraph(testGraph, [1])).toBe(2);
  });
});

describe('graph optimization and evaluation', () => {
  it('should optimize simple graph', () => {
    expect(optimizeGraph(testGraph).graph.nodes[2].value).toBeCloseTo(3, 2);
  });

  it.skip('should optimize graph with two disparate networks', () => {
    expect(optimizeGraph(testGraph2).graph.nodes[2].value).toBeCloseTo(3, 2);
  });

  it.skip('should optimize graph with two disparate networks', () => {
    expect(optimizeGraph(testGraph2).graph.nodes[4].value).toBeCloseTo(100, 2);
  });
});
