export default {
  name: "mj-style",
  handler: (el, { css }) => {
    const innerText = el.children.map(child => child.type === 'text' && child.data).join('')

    css.push(innerText)
  }
}
