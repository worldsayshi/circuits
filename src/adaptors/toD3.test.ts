import toD3 from "./toD3";
import testGraph2 from "../model/testGraph2";
import testgraph from "./testgraph";
import d3TestGraph from "./d3TestGraph";
import d3TestGraph2 from "./d3TestGraph2";


describe('toD3', () => {

  it('should convert to d3 representation', () => {
    const d3Graph = toD3(testgraph);
    console.log('testgraph', JSON.stringify(testgraph));
    expect(d3Graph.nodes).toEqual(d3TestGraph.nodes);
    expect(d3Graph.links).toEqual(d3TestGraph.links);
    expect(d3Graph).toEqual(d3TestGraph);
  });
  
  it('should convert to d3 representation 1', () => {
    const d3Graph = toD3(testGraph2.graph);
    expect(d3Graph.nodes).toEqual(d3TestGraph2.nodes);
    expect(d3Graph.links).toEqual(d3TestGraph2.links);
    expect(d3Graph).toEqual(d3TestGraph2);
  });
});