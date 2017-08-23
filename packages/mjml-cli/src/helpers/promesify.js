import fs from 'fs'

const stdinToBuffer = (stream, done) => {
  let buffer = ''

  stream.on('data', (chunck) => {
    buffer += chunck
  })

  stream.on('end', () => {
    done(null, buffer)
  })
}

const promisify = fn =>
  (...args) =>
    new Promise((resolve, reject) =>
      fn(...args.concat((err, ...data) =>
        (err ? reject(err) : resolve(...data)))))


export const write = promisify(fs.writeFile)
export const read = promisify(fs.readFile)
export const readStdin = promisify(stdinToBuffer)
