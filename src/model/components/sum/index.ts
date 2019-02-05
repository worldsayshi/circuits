
const partialSum : (a : number | string, b : number | string) => string = (a, b) => `${a} + ${b}`;

function zeroIfEmpty(l) {
  if(!l.length) return ['0'];
  else return l;
}

export default {
  img: 'img/thing.svg',
  operation: (left : (number | string)[], right : (number | string)[]) =>
    `${zeroIfEmpty(left).reduce(partialSum)} - (${zeroIfEmpty(right).reduce(partialSum)})`
}
