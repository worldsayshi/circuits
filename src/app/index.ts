
import createCore from '../calc/createCore';

// import toD3 from "../adaptors/toD3";
// import update from './render/update';
import View from "./View";

function initCore() {
  const graph = { nodes: [
      { noun: 'default', constant: true, value: 1 },
      { noun: 'default', constant: true, value: 1 },
      { noun: 'default', constant: true, value: 1 },
      { noun: 'default', constant: true, value: 1 },

      { noun: 'default', constant: true, value: 1 },
      { noun: 'default', constant: true, value: 1 },
      { noun: 'default', constant: true, value: 1 },
      { noun: 'default', constant: true, value: 1 },
      { noun: 'default', constant: true, value: 1 },
    ],
    components: [
      { left: [0, 1], right: [2, 3], verb: 'sum' },
      { left: [4, 5, 6, 8], right: [7], verb: 'sum' },
    ] };
  return createCore({ graph });
}




export default function app () {
  const core = initCore();
  const view = new View(core);

  window.optimize = () => core.dispatch({ type: 'OPTIMIZE' });
};
