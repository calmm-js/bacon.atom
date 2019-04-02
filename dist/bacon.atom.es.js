import { get, modify } from 'partial.lenses';
import { always, id, identicalU } from 'infestines';
import { Bus, Observable, combineWith } from 'baconjs';

function set(value) {
  this.modify(always(value));
}

function getLens() {
  var lens = this.lens;
  if (void 0 !== lens) return get(lens, this.parent.get());
}

function modifyLens(x2x) {
  var lens = this.lens;
  if (void 0 !== lens) this.parent.modify(modify(lens, x2x));
}

function view(lens) {
  var atom = this;

  if (lens instanceof Observable) {
    atom = combineWith(lens, atom, function (lens, data) {
      return get(atom.lens = lens, data);
    });
  } else {
    atom = atom.map(get(lens)).skipDuplicates(identicalU);
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
  var bus = new Bus();
  var atom = bus.scan(value, function (v, fn) {
    return atom.value = fn(v);
  }).skipDuplicates(identicalU);

  atom.subscribe(id);

  atom.value = value;
  atom.bus = bus;
  atom.modify = modifyRoot;
  atom.get = getRoot;
  atom.set = set;
  atom.view = view;

  return atom;
});

export default bacon_atom;
