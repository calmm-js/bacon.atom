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
