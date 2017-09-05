# Changelog

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
