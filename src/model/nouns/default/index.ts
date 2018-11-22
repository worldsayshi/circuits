import Var from "../../types/var";


export default {
  getNoun: ({ value, constant = false, variableCount }: Var) : string | number => {
    if (value === undefined && constant) {
      throw new Error(`A constant must not be undefined`);
    }
    if (constant) {
      return value;
    }
    return `x[${variableCount+1}]`;
  }
}
