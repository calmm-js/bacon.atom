import {compose, get, modify} from "partial.lenses"
import {acyclicEqualsU, id} from "infestines"
import {Bus} from "baconjs"

function set(value) { this.modify(() => value) }

function getLens() { return get(this.mapper, this.parent.get()) }
function modifyLens(x2x) { this.parent.modify(modify(this.mapper, x2x)) }

function lens(...ls) {
  console.warn("The `lens` method is deprecated.  Use the `view` method.")
  return this.view(...ls)
}

function view(...ls) {
  const mapper = compose(...ls)

  const atom = this.map(get(mapper)).skipDuplicates(acyclicEqualsU)

  atom.parent = this
  atom.mapper = mapper
  atom.modify = modifyLens
  atom.get = getLens
  atom.set = set
  atom.lens = process.env.NODE_ENV === "production" ? view : lens
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
  atom.lens = process.env.NODE_ENV === "production" ? view : lens
  atom.view = view

  return atom
}
