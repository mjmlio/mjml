import path from 'path'
import fs from 'fs'

export default function readMjmlConfig(filePath = process.cwd()) {
  try {
    const mjmlConfigPath = path.basename(filePath) === '.mjmlconfig'
      ? path.resolve(filePath)
      : path.resolve(filePath, '.mjmlconfig')
    const componentRootPath = path.dirname(mjmlConfigPath)
    const mjmlConfig = JSON.parse(fs.readFileSync(path.resolve(mjmlConfigPath), 'utf8'))
    return mjmlConfig.packages.map(compPath => path.resolve(componentRootPath, compPath))
  } catch (e) {
    if (e.code !== 'ENOENT') {
      console.log('Error reading mjmlconfig : ', e)
    }
    return []
  }
}
