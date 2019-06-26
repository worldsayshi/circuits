
import optimizeGraph, { lookup } from './optimizeGraph';
import testGraph from '../testGraph';
import testGraph2 from '../testGraph2';
import testGraph3 from '../testGraph_socket';
import {getNounResolvers} from "../nouns/index";
import nounify from "../nouns/nounify";
import * as math from 'mathjs';
import {objectiveFunction} from "./objectiveFunction";
// import objectiveFunction from "./objectiveFunction";

describe('nounify', () => {
  it('should return constants', () => {
    const values = nounify([{ noun: 'default', value: 4, constant: true }], getNounResolvers());

    expect(values).toEqual([4]);
  });

  it('should return variable injections', () => {
    const exprs = nounify([{ noun: 'default', constant: false, variableCount: 0 }], getNounResolvers());
    expect(exprs.map(expr => math.eval(expr, {x:[4]}))).toEqual([4]);

    const exprs2 = nounify([{ noun: 'default', variableCount: 0 }], getNounResolvers());
    expect(exprs.map(expr => math.eval(expr, {x:[4]}))).toEqual([4]);
  });

  it('more stuff', () => {
    const exprs = nounify(lookup([2], [
        { noun: 'default', constant: true, value: 1 },
        { noun: 'default', constant: true, value: 2 },
        { noun: 'default', variableCount: 0 },
    ]), getNounResolvers());

    expect(exprs.map(expr => math.eval(expr, {x:[4]}))).toEqual([4]);
  })
});

describe('graph optimization and evaluation', () => {
  it('should optimize simple graph', () => {
    expect(optimizeGraph(testGraph).graph.nodes[2].value).toBeCloseTo(3, 2);
  });

  it('should optimize graph with two disparate networks', () => {
    expect(optimizeGraph(testGraph2).graph.nodes[2].value).toBeCloseTo(3, 2);
  });

  it('should optimize graph with two disparate networks', () => {
    expect(optimizeGraph(testGraph2).graph.nodes[4].value).toBeCloseTo(100, 2);
  });

  // TODO Before this is possible I should rewrite Graph so that I don't need to alter
  // indices each time I change nodes
  it('should optimize graph with embedded custom component', () => {
    expect(optimizeGraph(testGraph3).graph.nodes[2].value).toBeCloseTo(1, 2 );
  });
});
