import Var from "../../types/var";


export default {
  getNoun: ({ value = 0, constant = false, variableCount = -1 }: Var): string | number => {
    if (value === undefined && constant) {
      throw new Error(`A constant must not be undefined`);
    }
    if (constant) {
      return value;
    }
    return `x[${variableCount+1}]`;
  }
}
