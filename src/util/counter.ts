

export default function counter(from) {
  let val = from;
  return function* count () {
    while (true) {
      yield val;
      val += 1;
    }
  }
}