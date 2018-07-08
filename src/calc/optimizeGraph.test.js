
import optimizeGraph from './optimizeGraph';
import testGraph from '../testGraph';

describe('graph optimization and evaluation', () => {
  test('optimizeGraph', () => {
    expect(optimizeGraph(testGraph).nodes[2].value).toBeCloseTo(3, 2);
  });
});
