
export default function mapValues (o, f) {
  let res = {};
  for (let k of Object.keys(o)) {
    res[k] = f(o[k]);
  }
  return res;
}