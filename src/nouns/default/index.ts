

export default {
  getNoun: ({ value, constant = false }, index) => {
    if (value === undefined && constant) {
      throw new Error(`A constant must not be undefined, see node ${index}`);
    }
    if (constant) {
      return value;
    }
    return `x[${index+1}]`;
  }
}
