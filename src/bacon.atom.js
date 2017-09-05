import {get, modify} from "partial.lenses"
import {acyclicEqualsU, id} from "infestines"
import {Bus, Observable, combineWith} from "baconjs"

function set(value) { this.modify(() => value) }

function getLens() {
  const lens = this.lens
  if (void 0 !== lens)
    return get(lens, this.parent.get())
}

function modifyLens(x2x) {
  const lens = this.lens
  if (void 0 !== lens)
    this.parent.modify(modify(lens, x2x))
}

function view(lens) {
  let atom

  if (lens instanceof Observable) {
    atom = combineWith(lens, this, (lens, data) => get(atom.lens = lens, data))
  } else {
    atom = this.map(get(lens)).skipDuplicates(acyclicEqualsU)
    atom.lens = lens
  }

  atom.parent = this
  atom.modify = modifyLens
  atom.get = getLens
  atom.set = set
  atom.view = view
  return atom
}

function getRoot() { return this.value }
function modifyRoot(x2x) { this.bus.push(x2x) }

export default value => {
  const bus = Bus()
  const atom = bus.scan(value, (v, fn) => atom.value = fn(v)).skipDuplicates(acyclicEqualsU)

  atom.subscribe(id)

  atom.value = value
  atom.bus = bus
  atom.modify = modifyRoot
  atom.get = getRoot
  atom.set = set
  atom.view = view

  return atom
}
