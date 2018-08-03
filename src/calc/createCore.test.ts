
import {createCore} from './createCore';

describe('createCore', () => {
  it('should return stored graph', () => {
    const graph = { nodes: [] };
    const core = createCore({ graph });

    const graph2 = core.getState();
    expect(graph).toEqual(graph2);
  });

  it('should call subscription sometimes', (done) => {
    const graph = { nodes: [] };
    const core = createCore({ graph });

    core.subscribe(() => {
      const graph2 = core.getState();
      expect(graph).toEqual(graph2);
      done();
    });

    core.dispatch({ type: 'NOOP' });
  });

  it('should optimize the graph', (done) => {
    const graph = {
      nodes: [
        { noun: 'default', constant: true, value: 1, type: 'Var' },
        { noun: 'default', constant: false, type: 'Var' },
        { left: [0], right: [1], verb: 'sum', type: 'Component' },
      ],
    };
    const core = createCore({ graph });

    core.subscribe(() => {
      const graph2 = core.getState();
      expect(graph2.nodes[1].value).toBeCloseTo(1, 2);
      done();
    });

    core.dispatch({ type: 'OPTIMIZE' });
  });

  it('should optimize graph 2', (done) => {
    const graph = { nodes: [
        { noun: 'default', constant: true, value: 1, type: 'Var' },
        { noun: 'default', constant: true, value: 1, type: 'Var' },
        { noun: 'default', constant: true, value: 1, type: 'Var' },
        { noun: 'default', constant: true, value: 1, type: 'Var' },

        { noun: 'default', constant: true, value: 1, type: 'Var' },
        { noun: 'default', constant: true, value: 1, type: 'Var' },
        { noun: 'default', constant: true, value: 1, type: 'Var' },
        { noun: 'default', constant: true, value: 1, type: 'Var' },
        { noun: 'default', constant: true, value: 1, type: 'Var' },

        { left: [0, 1], right: [2, 3], verb: 'sum', type: 'Component' },
        { left: [4, 5, 6, 8], right: [7], verb: 'sum', type: 'Component' },
      ]};
    const core = createCore({ graph });

    core.subscribe(() => {
      const graph2 = core.getState();
      expect(graph2.nodes[1].value).toBeCloseTo(1, 2);
      done();
    });

    core.dispatch({ type: 'OPTIMIZE' });
  });
});
