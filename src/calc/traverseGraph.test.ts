import traverseGraph from './traverseGraph';
import testGraph from '../testGraph';
import testGraph2 from '../testGraph2';


describe('traverseGraph', () => {
  it('should produce expressions for simple graph', () => {
    expect(traverseGraph(testGraph)).toEqual(['1 + 2 - (x[1])']);
  });

  it('should produce expressions for each disparate graph', () => {
    expect(traverseGraph(testGraph2)).toEqual(['1 + 2 - (x[1])', '100 - (x[2])']);
  });
});