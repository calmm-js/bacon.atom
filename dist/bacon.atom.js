(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('partial.lenses'), require('infestines'), require('baconjs')) :
	typeof define === 'function' && define.amd ? define(['partial.lenses', 'infestines', 'baconjs'], factory) :
	(global.bacon = global.bacon || {}, global.bacon.atom = factory(global.L,global.I,global.Bacon));
}(this, (function (partial_lenses,infestines,baconjs) { 'use strict';

function set(value) {
  this.modify(infestines.always(value));
}

function getLens() {
  var lens = this.lens;
  if (void 0 !== lens) return partial_lenses.get(lens, this.parent.get());
}

function modifyLens(x2x) {
  var lens = this.lens;
  if (void 0 !== lens) this.parent.modify(partial_lenses.modify(lens, x2x));
}

function view(lens) {
  var atom = this;

  if (lens instanceof baconjs.Observable) {
    atom = baconjs.combineWith(lens, atom, function (lens, data) {
      return partial_lenses.get(atom.lens = lens, data);
    });
  } else {
    atom = atom.map(partial_lenses.get(lens)).skipDuplicates(infestines.identicalU);
    atom.lens = lens;
  }

  atom.parent = this;
  atom.modify = modifyLens;
  atom.get = getLens;
  atom.set = set;
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
  }).skipDuplicates(infestines.identicalU);

  atom.subscribe(infestines.id);

  atom.value = value;
  atom.bus = bus;
  atom.modify = modifyRoot;
  atom.get = getRoot;
  atom.set = set;
  atom.view = view;

  return atom;
});

return bacon_atom;

})));
