
import fmin from 'fmin';
import njs from '../numericjs/numeric-1.2.6';
import evalComponent from './evalComponent';

export default function evalGraph (graphContext) {
  const optimization = fmin.nelderMead((x) => {
    const sum = evalComponent(graphContext, x);
    return Math.abs(sum);
  }, [100]);
  return optimization.x.map(v => Math.round(v * 100) / 100);
};
