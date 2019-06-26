import sum from './sum/index';
import embedded from './embedded/index';

export interface VerbData {
  [key: string]: { img?: string };
}

export interface VerbResolvers {
  [key: string]: (left: (number | string)[], right: (number | string)[]) => string
}

export function getVerbData() : VerbData {
  return {
    sum: {
      img: sum.img,
    },
    embedded: {

    },
  }
}

export function getVerbResolvers() : VerbResolvers {
  return {
    sum: sum.operation,
    //embedded: embedded.operation,
  };
}
