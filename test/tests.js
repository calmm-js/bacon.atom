import Atom  from "../src/bacon.atom"
import R     from "ramda"

function show(x) {
  switch (typeof x) {
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

  const y = xy.lens(R.lensProp("x"))

  testEq('xy.set({x: {y: 2}}) ; xy.get()',
         () => {xy.set({x: {y: 2}}) ; return xy.get()},
         {x: {y: 2}})

  testEq('const y = xy.lens(R.lensProp("x")) ; y.get()', () => y.get(), {y: 2})

  testEq('y.set({y: 3}); y.get()', () => {y.set({y: 3}); return y.get()}, {y: 3})

  const z = y.lens(R.lensProp("y"))

  testEq('const z = y.lens(R.lensProp("y")) ; z.get()', () => z.get(), 3)

  testEq('z.set(4) ; z.get()', () => {z.set(4) ; z.get() ; return z.get()}, 4)
})
