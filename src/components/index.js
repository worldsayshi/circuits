import sum from './sum';


export function getVerbResolvers() {
  return {
    sum: sum.operation,
  };
}
