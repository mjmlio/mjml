export default function genRandomHexString(length) {
  let str = ''
  for (let i = 0; i < length; i += 1) {
    str += Math.floor(Math.random() * 16).toString(16)
  }
  return str
}
