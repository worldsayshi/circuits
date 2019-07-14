import { nelderMead, conjugateGradient } from 'fmin';
import { minimize_Powell, minimize_L_BFGS, minimize_GradientDescent } from 'optimization-js';

// Hacky optimizer for now. Don't sure why nelderMead fails for some cases. Don't care just now.
// Also super slow now

export default (f, init) => {
  let repeats = 5;

  let i, solution;

  for (i = 0; i < repeats; i++) {
    solution = nelderMead(
      x => f(x),
      init
      //, { maxIterations: init.length * 200 * 10 }
    );
    init = solution.x;
  }

  return solution;
};