var fmin = require('fmin');
// import * as  from 'fmin';
var njs = require('../numericjs/numeric-1.2.6');
// import * as njs from ;
// Testing out various optimization methods
// njs.uncmin
// fmin.nelderMead
// fmin.conjugateGradient
function f(X) {
    return Math.abs(5 - X[0]);
}
describe('optimize', function () {
    it('fmin.nelderMead', function () {
        var solution = fmin.nelderMead(f, [500000]);
        expect(solution.x[0]).toBeCloseTo(5, 2);
    });
    it('njs.uncmin', function () {
        var res = njs.uncmin(f, [500000]);
        // console.log('njs.uncmin solution', res.solution);
        expect(res.solution[0]).toBeCloseTo(5, 2);
    });
});
