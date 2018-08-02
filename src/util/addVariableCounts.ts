import Graph from "../graph";
import counter from "./counter";


export default function addVariableCounts({ nodes, ...graph }: Graph): Graph {
  const variableCounter = counter(0);
  return {
    ...graph,
    nodes: nodes.map(n => ({
      ...n,
      ...(!n.constant && {
        variableCount: variableCounter.next().value,
      })
    })),
  };
}