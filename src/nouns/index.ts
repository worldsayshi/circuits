import defaultNounResolver from './default';

export interface NounResolvers {
  [key: string]: (node: {value: number, constant: boolean, variableCount?: number}) => string | number;
}

export function getNounResolvers() : NounResolvers {
  return {
    default: defaultNounResolver.getNoun,
  };
}
