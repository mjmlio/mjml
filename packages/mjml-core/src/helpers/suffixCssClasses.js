export default (classes, suffix) =>
  classes
    ? classes
        .split(' ')
        .map((c) => `${c}-${suffix}`)
        .join(' ')
    : ''
