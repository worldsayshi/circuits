import {VerbResolvers} from "./components";
import {NounResolvers} from "./nouns";

export default interface GraphContext {
  graph: any;
  verbs: VerbResolvers;
  nouns: NounResolvers;
}