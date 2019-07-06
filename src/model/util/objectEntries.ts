
export default function objectEntries<T>(obj: {[key: string]: T}): [string, T][] {
  return Object.keys(obj).map(k => (<[string, T]>[k, obj[k]]));
}