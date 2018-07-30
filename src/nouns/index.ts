import defaultNounResolver from './default';

export interface NounResolvers {
  [key: string]: ({value: number, constant: boolean}, index: number) => string;
}

export function getNounResolvers() : NounResolvers {
  return {
    default: defaultNounResolver.getNoun,
  };
}
