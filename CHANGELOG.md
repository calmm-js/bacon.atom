# Changelog

## 5.0.0

Removed the `lens` method and changed `view` to take exactly one argument.
These functionalities were previously deprecated.

Enhanced the `view` method to allow the argument lens to be an observable.

Previously duplicates were skipped with a structural acyclic equality predicate.
This is ideal in the sense that unnecessary updates are eliminated.  Now
duplicates are skipped with the equivalent of `Object.is`.  The `kefir.atom`
library made this change earlier and it has worked well in practise.  There are
two main reasons for the change:

* Structural equality is slowish, because it potentially needs to examine the
  whole object tree.  When either dealing with a large number of properties or
  with properties that are large objects, it can become a bottleneck.

* In practise, when embedding properties to VDOM that are computed with lenses
  from a state atom, `Object.is` is enough to eliminate almost all unnecessary
  updates and can be implemented so that it works several orders magnitude
  faster a structural equality.

In cases where you really want a more thorough equality check, you can
explicitly use Bacon's `skipDuplicates`.

## 4.0.8

The `view` method now gives a warning if you pass it any other number of
parameters except 1.  The reason that the `view` method accepted multiple
arguments was that the notation for composing lenses was initially more
cumbersome, but it has been possible to use array notation for composing lenses
for quite some time.  Only accepting a single argument makes the implementation
of `view` simpler and faster with negligible notational burden.  This also takes
`bacon.atom` a step closer to `kefir.atom`.

```diff
-atom.view(...ls)
+atom.view([...ls]
```

## 4.0.6

This library now explicitly depends only on
the [stable subset](https://github.com/calmm-js/partial.lenses/#stable-subset)
of partial lenses.

## 4.0.0

Previously duplicates were skipped with Ramda's `equals`.  Now duplicates are
skipped using `acyclicEqualsU` predicate from `infestines`.  The difference is
that `acyclicEqualsU` does not handle cyclic structures and that it expects that
any `equals` method on objects with a non `Object` constructor actually works
correctly.  This change has two advantages:

* `infestines` is already used by `partial.lenses` and the Ramda dependency is
  now dropped.

* `acyclicEqualsU` is much faster than Ramda's `equals`.

Unless you have cyclic model objects, which you shouldn't, this change should
not make any difference except slightly improved performance.
