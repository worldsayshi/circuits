
import fmin from 'fmin';
import njs from '../numericjs/numeric-1.2.6';
import evalGraph from './evalGraph';

export default function optimizeGraph (graphContext) {
  const optimization = fmin.nelderMead((x) => {
    const sum = evalGraph(graphContext, x);
    return Math.abs(sum);
  }, [100]);
  return optimization.x.map(v => Math.round(v * 100) / 100);
};
