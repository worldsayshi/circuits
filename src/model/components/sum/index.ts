
const partialSum : (a : number | string, b : number | string) => string = (a, b) => `${a} + ${b}`;

export default {
  img: 'img/thing.svg',
  operation: (left : (number | string)[], right : (number | string)[]) =>
    `${left.reduce(partialSum)} - (${right.reduce(partialSum)})`
}
