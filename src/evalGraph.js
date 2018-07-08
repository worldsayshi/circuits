
import fmin from 'fmin';
import njs from './numericjs/numeric-1.2.6';
import componentSum from './componentSum';

export default function (graphContext) {
  debugger;


  const optimization = fmin.nelderMead((x) => {
    const sum = componentSum(graphContext, x);
    return Math.abs(sum);
  }, [100]);
  return optimization.x.map(v => Math.round(v * 100) / 100);
};
