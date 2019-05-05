import { pascalCase } from './name'

export function loadClass(folderPath: string, name: string, suffix: string = 'ts') {
  const path = `${folderPath}/${name}.${suffix}`.replace(/\.\./g, '.').replace(/\/\//g, '/')
  const defined = require(path)
  let clz = defined.default
  if (!clz) {
    const className = Object.keys(defined).find(definedName => definedName === pascalCase(name))
    return defined[className]
  }
  return clz
}
