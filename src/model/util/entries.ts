
export default function entries<T> (l: T[]): [number, T][] {
  return l.map((e, ix) => (<[number, T]>[ix, e]));
}