# Changelog

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
