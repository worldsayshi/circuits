import {VerbResolvers} from "./components/index";
import {NounResolvers} from "./nouns/index";
import Graph from "./types/graph";

export default interface GraphContext {
  graph: Graph;
  verbs: VerbResolvers;
  nouns: NounResolvers;
}