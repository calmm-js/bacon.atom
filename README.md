[![npm version](https://badge.fury.io/js/bacon.atom.svg)](http://badge.fury.io/js/bacon.atom)

An alternative to [Bacon.Model](https://github.com/baconjs/bacon.model).

## Usage

```jsx
import R    from "ramda"
import Atom from "bacon.atom"
...
const model = Atom({x: 1})
const x = model.lens(R.lensProp("x"))
```

`atom.lens(...)` does not create a cycle; the object returned by `lens` can be
garbage collected.

Aside from having `modify`, `set` and `lens` methods, an Atom is like a Bacon
property.  Furthermore, because an Atom effectively always has a value, it is
possible to get the value of an Atom synchronously.  So, for convenience, an
Atom also has a slow, but synchronous, `get` method.  Use of `get` is
discouraged: prefer to depend on an atom as you would
[with any other observable](https://github.com/baconjs/bacon.js/#latest-value-of-property-or-eventstream)
whenever possible.

An Atom skips duplicate values according to Ramda's `equals` function by
default.  You can specify the equality predicate as an optional second argument
to `atom.lens(..., eq)` and `Atom(..., eq)`.
