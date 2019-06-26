
import { createStore, Store } from 'redux';
import * as dp from 'dot-prop-immutable';
import * as jsdiff from 'jsondiffpatch';
import { getVerbResolvers, getVerbData, VerbResolvers } from '../components/index';
import {getNounResolvers, NounResolvers} from '../nouns/index';
import optimizeGraph from "./optimizeGraph";
import Var, {isVar} from "../types/var";
import Node from '../types/node';
import Component from "../types/component";
import increaseAllComponentIndexes from "../util/increaseAllComponentIndexes";
// import {Core} from "./createCore";


function createGraphReducer({ nouns, verbs } : { nouns: NounResolvers, verbs: VerbResolvers }) {
  return (graph : { nodes: Node[] } = { nodes: [], }, action) => {

    switch (action.type) {
      case 'CLEAR_GRAPH':
        return { nodes: [], };
      case 'NEW_COMPONENT': {
        /*
        * const { coordinates: { x, y } } = action;
        return { ...graph, nodes: [
            { noun: 'default', constant: true, value: 1, type: 'Var', x, y },
            ...increaseAllComponentIndexes(graph.nodes),
          ],
        };*/
        return {
          nodes: [
            { type: 'Socket', noun: 'default', side: 'right' },
            { type: 'Socket', noun: 'default', side: 'left' },
          ],
        };
      }

      case 'OPTIMIZE':
        const { graph: newGraph } = optimizeGraph({ graph, nouns, verbs });
        return newGraph;
      case 'TOGGLE_CONSTANT': {
        let node = graph.nodes[action.index];
        if (node && isVar(node)) {
          return dp.set(graph, `nodes.${action.index}.constant`, !(node).constant);
        }
        console.warn('TOGGLE_CONSTANT failed', action.index, graph.nodes[action.index]);
        return graph;
      }
      case 'INC_VALUE': {
        let node : Node = graph.nodes[action.index];
        if (node && isVar(node)) {
          return dp.set(graph, `nodes.${action.index}.value`, (node.value || 0) + 1);
        }
        console.warn('TOGGLE_CONSTANT failed', action.index, graph.nodes[action.index]);
        return graph;
      }
      case 'ADD_LINK': {
        const {
          fromId,
          toId,
          fromSubselection,
          toSubselection,
        } = action;

        const fromNode = graph.nodes[fromId];
        const toNode =  graph.nodes[toId];
        // Add the node to the list of adjacencies of the component
        if (fromNode.type === 'Component') {
          if (toNode.type !== 'Component') {
            // Drawing from a component to a node
            const adjacencies = dp.get(graph, `nodes.${fromId}.${fromSubselection}`);
            return dp.set(graph, `nodes.${fromId}.${fromSubselection}`,
              adjacencies.includes(toId) ? adjacencies : [...adjacencies, toId]);
          }
        } else if (toNode.type === 'Component') {
          if (fromNode.type === 'Var' || fromNode.type === 'Socket') {
            // Drawing from a node to a component
            const adjacencies = dp.get(graph, `nodes.${toId}.${toSubselection}`);
            return dp.set(graph, `nodes.${toId}.${toSubselection}`,
              adjacencies.includes(fromId) ? adjacencies : [...adjacencies, fromId]);
          }
        }
        return graph;
      }
      case 'ADD_NODE_2': {
        const { coordinates: { x, y } } = action;
        return { ...graph, nodes: [
            { noun: 'default', constant: true, value: 1, type: 'Var', x, y },
            ...increaseAllComponentIndexes(graph.nodes),
          ],
        };
      }
      case 'ADD_NODE': {
        const { coordinates: { x, y } } = action;
        return { ...graph, nodes: [
            { noun: 'default', constant: true, value: 1, type: 'Var', x, y },
            ...increaseAllComponentIndexes(graph.nodes),
          ],
        };
      }
      case 'ADD_COMPONENT': {
        const { coordinates: { x, y }, component } = action;
        return { ...graph, nodes: [
            ...graph.nodes,
            { ...component, x, y },
          ],
        };
      }
      case 'ADD_CUSTOM_COMPONENT': {
        const { component } = action;
        console.log('ADD_CUSTOM_COMPONENT')
        return { ...graph, nodes: [
            ...graph.nodes,
            component,
          ],
        };
      }
      case 'REPLACE_GRAPH': {
        return action.graph;
      }

      default:
        return graph;
    }
  };
}

export function attachDefaultData({ nodes }) {
  // const components = nodes.filter(({ type }) => (type === 'Component')).map()
  return {
    nodes: nodes.map((node) => {
      if (node.type === 'Component') {
        return {
          ...node,
          ...getVerbData()[node.verb],
        };
      }
      return node;
    })
  };
}

export function createCoreReducer ({ nouns = {}, verbs = {}  } = {}) {
  return createGraphReducer({
    nouns: { ...getNounResolvers(), ...nouns },
    verbs: { ...getVerbResolvers(), ...verbs },
  });
}

// Stateful core
export function createCore ({ graph, nouns = {}, verbs = {} }) {
  return createStore(createCoreReducer({ nouns, verbs }), attachDefaultData(graph));
}
