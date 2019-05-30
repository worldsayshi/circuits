
import {createCore} from './createCore';
import addNode from "./actions/addNode";
import addComponent from "./actions/addComponent";

const clone = obj => JSON.parse(JSON.stringify(obj));

const graph = {
  nodes: [
    { noun: 'default', constant: true, value: 1, type: 'Var' },
    { noun: 'default', constant: false, type: 'Var' },
    { left: [0], right: [1], verb: 'sum', type: 'Component' },
  ],
};

const graph2 = { nodes: [
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
    { left: [], right: [], verb: 'sum', type: 'Component' },
    { left: [4, 5, 6, 8], right: [7], verb: 'sum', type: 'Component' },
  ],
};

// TODO
// Recreate a problematic

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
    const core = createCore({ graph: clone(graph) });

    core.subscribe(() => {
      const graph2 = core.getState();
      expect(graph2.nodes[1].value).toBeCloseTo(1, 2);
      done();
    });

    core.dispatch({ type: 'OPTIMIZE' });
  });

  it('should optimize graph 2', (done) => {

    const core = createCore({ graph: clone(graph2) });

    core.subscribe(() => {
      const graph2 = core.getState();
      expect(graph2.nodes[1].value).toBeCloseTo(1, 2);
      done();
    });

    core.dispatch({ type: 'OPTIMIZE' });
  });

  it('should allow adding node', (done) => {
    const core = createCore({ graph: clone(graph2) });

    core.subscribe(() => {
      const graph2 = core.getState();

      /*
      Assuming that the node is added first,
      no component should refer to it.
       */

      expect(graph2.nodes).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            left: expect.arrayContaining([0])
          })
        ])
      );
      expect(graph2.nodes).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            right: expect.arrayContaining([0])
          })
        ])
      );
      done();
    });

    core.dispatch(addNode({ coordinates: { x: 10, y: 10 }}));
  });

  it('should not regress', (done) => {
    const core = createCore({ graph: clone(graph2) });

    core.subscribe(() => {
      const graph2 = core.getState();
      // console.log('graph2', JSON.stringify(graph2.nodes, null, 2));

      expect(graph2.nodes).toMatchSnapshot('regression-test-1');
      done();
    });

    core.dispatch(addNode({ coordinates: { x: 10, y: 10 } }));
    core.dispatch(addComponent({ coordinates: { x: 20, y: 20 } }));
    core.dispatch(addComponent({ coordinates: { x: 20, y: 20 } }));

  });

  it('trying out toMatchObject', () => {
    const things = [
      {foo: [1,2], bar: [1, 3]},
      {foo: [2], bar: [4, 5]}
    ];
    expect(things).toContainEqual({
      foo: expect.arrayContaining([1]),
      bar: expect.arrayContaining([3]),
    });
    expect(things).not.toContainEqual({
      foo: expect.arrayContaining([0]),
      bar: expect.arrayContaining([0]),
    });
  });
});
