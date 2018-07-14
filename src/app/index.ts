
import createCore from '../calc/createCore';

// import toD3 from "../adaptors/toD3";
// import update from './render/update';
import View from "./View";
import TestView from "./TestView";

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

declare global {
  interface Window {
    buttonOperations: any
    foo: any;
    optimize: any;
    toggleGuides: any;
  }
}




export default function app () {
  const view = new TestView();

  view.getOperations().forEach(({ name, f }) => {
    const button = document.createElement('button');
    button.appendChild(document.createTextNode(name));

    button.onclick = f;

    document.querySelector('#buttons').appendChild(button);
  });
  // view.start();
  // window.changeValue = () => view.changeValue();
};

// export default function _app () {
//   const core = initCore();
//   const view = new View(core);
//
//   window.foo = () => core.dispatch({ type: 'FOO' });
//   window.optimize = () => core.dispatch({ type: 'OPTIMIZE' });
// };
