An alternative to [Bacon.Model](https://github.com/baconjs/bacon.model).

## Usage

```jsx
import R    from "ramda"
import Atom from "bacon.atom"
...
const model = Atom({x: 1})
const x = model.lens(R.lensProp("x"))
```
