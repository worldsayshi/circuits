
import optimizeGraph, { lookup } from './optimizeGraph';
import testGraph from '../testGraph';
import testGraph2 from '../testGraph2';
import testGraph3 from '../testGraph_socket';
import {getNounResolvers} from "../nouns/index";
import nounify from "../nouns/nounify";
import * as math from 'mathjs';
import {objectiveFunction} from "./objectiveFunction";
import Var from "../types/var";
// import objectiveFunction from "./objectiveFunction";
import { nelderMead, conjugateGradient } from 'fmin';
import { minimize_Powell, minimize_L_BFGS, minimize_GradientDescent } from 'optimization-js';
import customOptimization from "./customOptimization";

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
    const exprs = nounify(lookup([2], {
        0: { noun: 'default', constant: true, value: 1 },
        1: { noun: 'default', constant: true, value: 2 },
        2: { noun: 'default', variableCount: 0 },
    }), getNounResolvers());

    expect(exprs.map(expr => math.eval(expr, {x:[4]}))).toEqual([4]);
  })
});

describe('graph optimization and evaluation', () => {
  it('should optimize simple expression', () => {
    let expr = 'abs(x[1] - 1) + abs(x[2] - x[1]) + abs(x[3] - x[2]) + abs(x[4] - x[3]) + abs(x[5] - x[4])';

    // [100, 100, 100, 100, 100]

    let solution = customOptimization(x => math.eval(expr, { x }), [50,50,50,50,50]);
    expect(solution.x[0]).toBeCloseTo(1, 2);
    expect(solution.x[1]).toBeCloseTo(1, 2);
    expect(solution.x[2]).toBeCloseTo(1, 2);
    expect(solution.x[3]).toBeCloseTo(1, 2);
  });

/*  it.only('should optimize simple expressions', () => {
    let expr = '0 + abs(x[1] - (x[2])) + abs(x[3] - (x[4])) + abs(1 - (x[3])) + abs(x[4] - (x[1]))';
    // nelderMead((x) => objectiveFunction(graphContext, x), initialValues, parameters);
    //console.log('minimize_Powell', minimize_Powell);
    let opt = minimize_GradientDescent((x) =>  console.log('X',  x, 'f(x)', math.eval(expr, { x })) || math.eval(expr, { x }), [10,10,10,10]);
    //console.log('OPT', opt);
    //expect(opt.x[0]).toBeCloseTo(1, 2);
  });*/

  it('should optimize simple graph', () => {
    expect((<Var>optimizeGraph(testGraph).graph.nodes[2]).value).toBeCloseTo(3, 2);
  });

  it('should optimize graph with two disparate networks', () => {
    expect((<Var>optimizeGraph(testGraph2).graph.nodes[2]).value).toBeCloseTo(3, 2);
  });

  it('should optimize graph with two disparate networks', () => {
    expect((<Var>optimizeGraph(testGraph2).graph.nodes[4]).value).toBeCloseTo(100, 2);
  });

  it.skip('should optimize graph with embedded custom component', () => {
    let optimizedGraph = optimizeGraph(testGraph3);
    // console.log('optimized graph', JSON.stringify(optimizedGraph, null, 2));
    expect((<Var>optimizedGraph.graph.nodes[2]).value).toBeCloseTo(1, 2);
  });
});
