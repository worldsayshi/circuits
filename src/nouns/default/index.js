

export default {
  getNoun: ({ value, constant = false }, index, x) => {
    if (value === undefined && constant) {
      throw new Error(`A constant must not be undefined, see node ${index}`);
    }
    if (value === undefined || constant) {
      return x[index];
    }
    return value;
  }
}
