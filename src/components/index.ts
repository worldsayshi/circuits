import sum from './sum';


export function getVerbData() {
  return {
    sum: {
      img: sum.img,
    },
  }
}

export function getVerbResolvers() {
  return {
    sum: sum.operation,
  };
}
