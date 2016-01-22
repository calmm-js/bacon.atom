import Bacon from "baconjs"
import R     from "ramda"

function ignore() {}

function set(value) { this.modify(() => value) }

function getLens() { return R.view(this.mapper, this.parent.get()) }
function modifyLens(x2x) { this.parent.modify(R.over(this.mapper, x2x)) }

function lens(l, eq = R.equals) {
  const atom = this.map(R.view(l)).skipDuplicates(eq)

  atom.parent = this
  atom.mapper = l
  atom.modify = modifyLens
  atom.get = getLens
  atom.set = set
  atom.lens = lens

  return atom
}

function getRoot() { return this.value }
function modifyRoot(x2x) { this.bus.push(x2x) }

export default (value, eq = R.equals) => {
  const bus = Bacon.Bus()
  const atom = bus.scan(value, (v, fn) => atom.value = fn(v)).skipDuplicates(eq)

  atom.subscribe(ignore)

  atom.value = value
  atom.bus = bus
  atom.modify = modifyRoot
  atom.get = getRoot
  atom.set = set
  atom.lens = lens

  return atom
}
