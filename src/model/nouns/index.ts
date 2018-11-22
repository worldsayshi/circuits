import defaultNounResolver from './default/index';
import Var from "../types/var";

export interface NounResolvers {
  [key: string]: (node: Var) => string | number;
}

export function getNounResolvers() : NounResolvers {
  return {
    default: defaultNounResolver.getNoun,
  };
}
