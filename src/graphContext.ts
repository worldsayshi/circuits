import {VerbResolvers} from "./components";
import {NounResolvers} from "./nouns";
import Graph from "./types/graph";

export default interface GraphContext {
  graph: Graph;
  verbs: VerbResolvers;
  nouns: NounResolvers;
}