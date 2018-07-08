
import evalGraph from './evalGraph';
import testGraph from '../testGraph';

describe('graph optimization and evaluation', () => {
  test('evalGraph', () => {
    expect(evalGraph(testGraph)[0]).toBeCloseTo(3, 2);
  });
});
