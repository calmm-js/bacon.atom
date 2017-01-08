import Atom   from "../src/bacon.atom"
import * as R from "ramda"

function show(x) {
  switch (typeof x) {
    case "string":
    case "object":
      return JSON.stringify(x)
    default:
      return `${x}`
  }
}

const testEq = (expr, lambda, expected) => it(
  `${expr} equals ${show(expected)}`, () => {
    const actual = lambda()
    if (!R.equals(actual, expected))
      throw new Error(`Expected: ${show(expected)}, actual: ${show(actual)}`)
  })

describe("Atom", () => {
  const xy = Atom({x: {y: 1}})

  testEq('const xy = Atom({x: {y: 1}}); xy.get()', () => xy.get(), {x: {y: 1}})

  const y = xy.lens("x")

  testEq('xy.set({x: {y: 2}}) ; xy.get()',
         () => {xy.set({x: {y: 2}}) ; return xy.get()},
         {x: {y: 2}})

  testEq('const y = xy.view("x") ; y.get()', () => y.get(), {y: 2})

  testEq('y.set({y: 3}); y.get()', () => {y.set({y: 3}); return y.get()}, {y: 3})

  const z1 = y.view("y")

  testEq('const z1 = y.view("y") ; z1.get()', () => z1.get(), 3)

  testEq('z1.set(4) ; z1.get()', () => {z1.set(4) ; z1.get() ; return z1.get()}, 4)

  const z2 = xy.view("x", "y")

  testEq('const z2 = xy.view("x", "y") ; z2.get()', () => z2.get(), 4)

  testEq('z2.set(3) ; z2.get()', () => {z2.set(3) ; z2.get() ; return z2.get()}, 3)
})
