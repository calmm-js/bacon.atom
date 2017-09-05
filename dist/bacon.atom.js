(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('partial.lenses'), require('infestines'), require('baconjs')) :
	typeof define === 'function' && define.amd ? define(['partial.lenses', 'infestines', 'baconjs'], factory) :
	(global.bacon = global.bacon || {}, global.bacon.atom = factory(global.L,global.I,global.Bacon));
}(this, (function (partial_lenses,infestines,baconjs) { 'use strict';

function set(value) {
  this.modify(function () {
    return value;
  });
}

function getLens() {
  return partial_lenses.get(this.mapper, this.parent.get());
}
function modifyLens(x2x) {
  this.parent.modify(partial_lenses.modify(this.mapper, x2x));
}

var header = "bacon.atom: ";

function warn(f, m) {
  if (!f.warned) {
    f.warned = 1;
    console.warn(header + m);
  }
}

function lens() {
  warn(lens, "The `lens` method is deprecated.  Use the `view` method.");
  return this.view.apply(this, arguments);
}

function view() {
  {
    if (arguments.length !== 1) warn(view, "In the next major version the `view` method will no longer take multiple arguments to compose as a lens.  Instead of `atom.view(...ls)` write `atom.view([...ls])`.");
  }

  var mapper = partial_lenses.compose.apply(undefined, arguments);

  var atom = this.map(partial_lenses.get(mapper)).skipDuplicates(infestines.acyclicEqualsU);

  atom.parent = this;
  atom.mapper = mapper;
  atom.modify = modifyLens;
  atom.get = getLens;
  atom.set = set;
  atom.lens = lens;
  atom.view = view;

  return atom;
}

function getRoot() {
  return this.value;
}
function modifyRoot(x2x) {
  this.bus.push(x2x);
}

var bacon_atom = (function (value) {
  var bus = baconjs.Bus();
  var atom = bus.scan(value, function (v, fn) {
    return atom.value = fn(v);
  }).skipDuplicates(infestines.acyclicEqualsU);

  atom.subscribe(infestines.id);

  atom.value = value;
  atom.bus = bus;
  atom.modify = modifyRoot;
  atom.get = getRoot;
  atom.set = set;
  atom.lens = lens;
  atom.view = view;

  return atom;
});

return bacon_atom;

})));
