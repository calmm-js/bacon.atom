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
property and
[has no "get" method](https://github.com/baconjs/bacon.js/#latest-value-of-property-or-eventstream).
