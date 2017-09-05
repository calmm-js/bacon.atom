import { compose, get, modify } from 'partial.lenses';
import { acyclicEqualsU, id } from 'infestines';
import { Bus } from 'baconjs';

function set(value) {
  this.modify(function () {
    return value;
  });
}

function getLens() {
  return get(this.mapper, this.parent.get());
}
function modifyLens(x2x) {
  this.parent.modify(modify(this.mapper, x2x));
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
  if (process.env.NODE_ENV !== "production") {
    if (arguments.length !== 1) warn(view, "In the next major version the `view` method will no longer take multiple arguments to compose as a lens.  Instead of `atom.view(...ls)` write `atom.view([...ls])`.");
  }

  var mapper = compose.apply(undefined, arguments);

  var atom = this.map(get(mapper)).skipDuplicates(acyclicEqualsU);

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
  var bus = Bus();
  var atom = bus.scan(value, function (v, fn) {
    return atom.value = fn(v);
  }).skipDuplicates(acyclicEqualsU);

  atom.subscribe(id);

  atom.value = value;
  atom.bus = bus;
  atom.modify = modifyRoot;
  atom.get = getRoot;
  atom.set = set;
  atom.lens = process.env.NODE_ENV === "production" ? view : lens;
  atom.view = view;

  return atom;
});

export default bacon_atom;
