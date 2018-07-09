

export default {
  getNoun: ({ value, constant = false }, index, x) => {
    if (value === undefined && constant) {
      throw new Error(`A constant must not be undefined, see node ${index}`);
    }
    if (x[index] === 'undefined' || constant) {
      return value;
    }
    return x[index];
  }
}
