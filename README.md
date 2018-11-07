[![npm version](https://badge.fury.io/js/bacon.atom.svg)](http://badge.fury.io/js/bacon.atom)
[![Build Status](https://travis-ci.org/calmm-js/bacon.atom.svg?branch=master)](https://travis-ci.org/calmm-js/bacon.atom)
[![Code Coverage](https://img.shields.io/codecov/c/github/calmm-js/bacon.atom/master.svg)](https://codecov.io/github/calmm-js/bacon.atom?branch=master)
[![](https://david-dm.org/calmm-js/bacon.atom.svg)](https://david-dm.org/calmm-js/bacon.atom)
[![](https://david-dm.org/calmm-js/bacon.atom/dev-status.svg)](https://david-dm.org/calmm-js/bacon.atom?type=dev)

An atom is a holder for a mutable, reactive value, meaning that you can modify its value
and observe changes to it. It's an extension to the Bacon.js [property](https://github.com/baconjs/bacon.js#property),
which always has an initial value and allows value mutation using the `set` and `modify` methods. It also allows
you to create linked "lensed atoms" that reflect a part of an Atom holding a complex value.

## Reference

```js
import Atom from "bacon.atom"
```

### Atom(initialValue)

Creates a new atom with the given initial value.  An atom is a modifiable
Bacon [property](https://github.com/baconjs/bacon.js#property).  Atoms (and
lensed atoms) implicitly skip duplicates using an acyclic structural equality
predicate.

### atom.get()

A slow operation to synchronously get the current value of the atom.  Use of
`get` is discouraged: prefer to depend on an atom as you would with ordinary
Bacon properties.

### atom.view(lens)

Creates a new lensed atom with the [partial
lens](https://github.com/calmm-js/partial.lenses/) from the original atom.
Modifications to the lensed atom are reflected in the original atom and vice
versa.

As of version 5.0.0 the `lens` is also allowed to be an observable that produces
a lens.  In that case the lens is not obtained from the observable until after
the lensed atom has been subscribed to and before that `get` returns `undefined`
and `modify` and `set` do nothing.

### atom.modify(currentValue => newValue)

Applies the given function to the current value of the atom and replaces the
value of the atom with the new value returned by the function.

### atom.set(value)

`atom.set(value)` is equivalent to `atom.modify(() => value)` and is provided
for convenience.
