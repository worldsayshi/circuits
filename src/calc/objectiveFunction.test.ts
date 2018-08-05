import {objectiveFunction} from "./objectiveFunction";
import testGraph from "../testGraph";


describe('sum ops', () => {
  it('should evaluate simple graph', () => {
    expect(testGraph.verbs.sum([5,6], [11])).toBe('5 + 6 - (11)');
    expect(testGraph.verbs.sum([11], [6,5])).toBe('11 - (6 + 5)');
    expect(testGraph.verbs.sum([11, 69], [80])).toBe('11 + 69 - (80)');
    expect(testGraph.verbs.sum([-20], [-30,10])).toBe('-20 - (-30 + 10)');
    expect(objectiveFunction(testGraph, [4])).toBe(1);
    expect(objectiveFunction(testGraph, [3])).toBe(0);
    expect(objectiveFunction(testGraph, [2])).toBe(1);
    expect(objectiveFunction(testGraph, [1])).toBe(2);
  });
});