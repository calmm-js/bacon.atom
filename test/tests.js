import Atom   from "../dist/bacon.atom.cjs"
import * as R from "ramda"
import {Observable, constant} from "baconjs"

function show(x) {
  switch (typeof x) {
    case "string":
    case "object":
      return JSON.stringify(x)
    default:
      return `${x}`
  }
}

const run = expr =>
  eval(`(Atom, constant) => ${expr}`)(Atom, constant)

const testEq = (exprIn, expected) => {
  const expr = exprIn.replace(/\s+/g, " ")
  return it(`${expr} => ${show(expected)}`, done => {
    const actual = run(expr)
    function check(actual) {
      if (!R.equals(actual, expected))
        throw new Error(`Expected: ${show(expected)}, actual: ${show(actual)}`)
      done()
    }
    if (actual instanceof Observable)
      actual.take(1).onValue(check)
    else
      check(actual)
  })
}

describe("Atom", () => {
  testEq(`{const xy = Atom({x: {y: 1}});
           return xy}`,
         {x: {y: 1}})

  testEq(`{const xy = Atom({x: {y: 1}});
           xy.set({x: {y: 2}});
           return xy.get()}`,
         {x: {y: 2}})

  testEq(`{const xy = Atom({x: {y: 1}});
           const y = xy.view("x");
           return y}`,
         {y: 1})

  testEq(`{const xy = Atom({x: {y: 1}});
           const y = xy.view("x");
           y.set({y: 3});
           return y}`,
         {y: 3})

  testEq(`{const xy = Atom({x: {y: 3}});
           const y = xy.view("x");
           const z1 = y.view("y");
           return z1.get()}`,
         3)

  testEq(`{const xy = Atom({x: {y: 3}});
           const y = xy.view("x");
           const z1 = y.view("y");
           z1.set(4) ;
           return z1.get()}`,
         4)

  testEq(`{const xy = Atom({x: {y: 3}});
           const z2 = xy.view(["x", "y"]);
           return z2.get()}`,
         3)

  testEq(`{const xy = Atom({x: {y: 2}});
           const z2 = xy.view(["x", "y"]);
           z2.set(3);
           return z2}`,
         3)

  testEq(`{const xy = Atom({x: 1, y: 2});
           const x = xy.view(constant("x"));
           if (x.get() !== undefined)
             return "get";
           x.set(-1);
           if (x.get() !== undefined)
             return "set";
           x.onValue(() => {});
           x.set(x.get() + 1);
           x.set(xy.get().x + 1);
           return x}`,
         3)
})
