export default function makeLowerBreakpoint(breakpoint) {
  try {
    const pixels = Number.parseInt(breakpoint.match('[0-9]+')[0], 10)
    return `${pixels - 1}px`
  } catch (e) {
    return breakpoint
  }
}
