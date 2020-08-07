const stdinSync = () =>
  new Promise((res) => {
    let buffer = ''

    const stream = process.stdin

    stream.on('data', (chunck) => {
      buffer += chunck
    })

    stream.on('end', () => res(buffer))
  })

export default async () => {
  const mjml = await stdinSync()
  return { mjml }
}
