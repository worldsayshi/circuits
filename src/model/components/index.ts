
export interface VerbData {
  [key: string]: { img?: string };
}

export interface VerbResolvers {
  [key: string]: (left: (number | string)[], right: (number | string)[]) => string
}

export function getVerbData() : VerbData {
  return {
    sum: {
      img: 'img/thing.svg',
    },
    embedded: {
      img: 'img/embedded.svg',
    },
  }
}

const partialSum : (a : number | string, b : number | string) => string = (a, b) => `${a} + ${b}`;

function zeroIfEmpty(l) {
  if(!l.length) return ['0'];
  else return l;
}

export function getVerbResolvers() : VerbResolvers {
  return {
    sum:  (left : (number | string)[], right : (number | string)[]) =>
      `${zeroIfEmpty(left).reduce(partialSum)} - (${zeroIfEmpty(right).reduce(partialSum)})`,
    //embedded: embedded.operation,
  };
}
