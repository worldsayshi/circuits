
export default function objectValues<T>(obj: {[key: string]: T}): T[] {
  return Object.keys(obj).map(k => (obj[k]));
}