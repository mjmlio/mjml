// require() of an ES module (Node 22.12+) returns its namespace object;
// unwrap its default export. Anything else is returned untouched.
export default function interopDefault(mod) {
  return Object.prototype.toString.call(mod) === '[object Module]' &&
    'default' in mod
    ? mod.default
    : mod
}
