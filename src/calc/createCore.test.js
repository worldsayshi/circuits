
import createCore from './createCore';

describe('createCore', () => {
  it('should return stored graph', () => {
    const graph = { nodes: [], components: [] };
    const core = createCore({ graph });

    const graph2 = core.getState();
    expect(graph).toEqual(graph2);
  });

  it('should call subscription sometimes', (done) => {
    const graph = { nodes: [], components: [] };
    const core = createCore({ graph });

    core.subscribe(() => {
      const graph2 = core.getState();
      expect(graph).toEqual(graph2);
      done();
    });

    core.dispatch({ type: 'NOOP' });
  });

  it('should optimize the graph', (done) => {
    const graph = { nodes: [
      { noun: 'default', constant: true, value: 1 },
      { noun: 'default' }
    ],
    components: [
      { left: [0], right: [1], verb: 'sum' },
    ] };
    const core = createCore({ graph });

    core.subscribe(() => {
      const graph2 = core.getState();
      expect(graph2.nodes[1].value).toBeCloseTo(1, 2);
      done();
    });

    core.dispatch({ type: 'OPTIMIZE' });
  });
});
