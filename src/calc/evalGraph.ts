// import nounify from "../nouns/nounify";
//
// // TODO cleanup: Not used anymore! Currently using evalGraph in optimizeGraph.ts instead!
//
// export default function evalGraph ({ graph: { nodes, components }, nouns, verbs }, x) {
//   return components.reduce((acc, {left, right, verb}) => {
//     const leftValues = nounify(left.map(i => nodes[i]), nouns, x);
//     const rightValues = nounify(right.map(i => nodes[i]), nouns, x);
//     return acc + verbs[verb](leftValues, rightValues);
//   }, 0);
// }
