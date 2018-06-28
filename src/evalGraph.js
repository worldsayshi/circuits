
import njs from './numericjs/numeric-1.2.6';
import componentSum from './componentSum';

export default function (graphContext) {
  debugger;

  const optimization = njs.uncmin((x) => {
    const sum = componentSum(graphContext, x);
    console.log('f(x)', Math.abs(sum));
    return Math.abs(sum);
  }, [100]);
  return optimization.solution.map(v => Math.round(v * 100) / 100);
};
