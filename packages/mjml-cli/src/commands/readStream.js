const stdinSync = () =>
  new Promise((res, rej) => {
    let buffer = ''

    const stream = process.stdin
    stream.setEncoding('utf8')

    stream.on('data', (chunk) => {
      buffer += chunk
    })

    stream.on('end', () => res(buffer))
    stream.on('error', rej)
  })

export default async () => {
  const mjml = await stdinSync()
  return { mjml }
}
