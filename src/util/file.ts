import { pascalCase } from './name'
import * as path from 'path'

export function loadClass(folderPath: string, name: string, suffix = 'ts') {
  const relativePath = `../../${folderPath}/${name}.${suffix}`.replace(/\.\./g, '.').replace(/\/\//g, '/')
  const absolutePath = path.join(path.resolve('.'), relativePath)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const defined = require(absolutePath)
  const clz = defined.default
  if (!clz) {
    const className = Object.keys(defined).find((definedName) => definedName === pascalCase(name))
    return defined[className]
  }
  return clz
}
