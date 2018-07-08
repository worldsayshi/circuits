
import optimizeGraph from './optimizeGraph';
import testGraph from '../testGraph';

describe('graph optimization and evaluation', () => {
  test('optimizeGraph', () => {
    expect(optimizeGraph(testGraph)[0]).toBeCloseTo(3, 2);
  });
});
