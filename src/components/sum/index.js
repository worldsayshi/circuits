

export default {
  img: 'img/thing.svg',
  operation: (left, right) =>
    left.reduce((a, b) => a + b, 0) - right.reduce((a, b) => a + b, 0)
}
