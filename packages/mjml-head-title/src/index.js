export default (el, { $container }) => {
  const innerText = el.children.map(child => child.type === 'text' && child.data).join('')

  $container('title').text(innerText)
}
