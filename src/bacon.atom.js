import Bacon from "baconjs"
import R     from "ramda"

function set(value) { this.modify(() => value) }

function modifyMap(x2x) { this.parent.modify(R.over(this.mapper, x2x)) }

function lens(l, eq = R.equals) {
  const atom = this.map(R.view(l)).skipDuplicates(eq)

  atom.parent = this
  atom.mapper = l
  atom.modify = modifyMap
  atom.set = set
  atom.lens = lens

  return atom
}

function modifyBus(x2x) { this.bus.push(x2x) }

function ignore() {}

export default (value, eq = R.equals) => {
  const bus = Bacon.Bus()
  const atom = bus.scan(value, (value, fn) => fn(value)).skipDuplicates(eq)

  atom.subscribe(ignore)

  atom.bus = bus
  atom.modify = modifyBus
  atom.set = set
  atom.lens = lens

  return atom
}
