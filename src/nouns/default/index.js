

export default {
  getNoun: ({ value }, index, x) => {
    if (value === undefined) {
      return x[index];
    }
    return value;
  }
}
