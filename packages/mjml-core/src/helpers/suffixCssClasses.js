export default (classes, suffix) => {
  return classes
    ? classes
        .split(' ')
        .map(c => `${c}-${suffix}`)
        .join(' ')
    : ''
}
