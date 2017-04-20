'use strict';

var partial_lenses = require('partial.lenses');
var infestines = require('infestines');
var baconjs = require('baconjs');

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

function lens() {
  if (!lens.warned) {
    lens.warned = 1;
    console.warn("The `lens` method is deprecated.  Use the `view` method.");
  }
  return this.view.apply(this, arguments);
}

function view() {
  var mapper = partial_lenses.compose.apply(undefined, arguments);

  var atom = this.map(partial_lenses.get(mapper)).skipDuplicates(infestines.acyclicEqualsU);

  atom.parent = this;
  atom.mapper = mapper;
  atom.modify = modifyLens;
  atom.get = getLens;
  atom.set = set;
  atom.lens = process.env.NODE_ENV === "production" ? view : lens;
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
  atom.lens = process.env.NODE_ENV === "production" ? view : lens;
  atom.view = view;

  return atom;
});

module.exports = bacon_atom;