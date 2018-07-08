
import createCore from './createCore';

describe('createCore', () => {
  it('should return stored graph', () => {
    const graph = { nodes: [], components: [] };
    const core = createCore({ graph });

    const graph2 = core.getState();
    expect(graph).toEqual(graph2);
  });

});
