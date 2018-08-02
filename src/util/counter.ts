

export default function* counter(from) {
  let val = from;
  while (true) {
    yield val;
    val += 1;
  }
}