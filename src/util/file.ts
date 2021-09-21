import { pascalCase } from './name'

export function loadClass(folderPath: string, name: string, suffix = 'ts') {
  const path = `${folderPath}/${name}.${suffix}`.replace(/\.\./g, '.').replace(/\/\//g, '/')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const defined = require(path)
  const clz = defined.default
  if (!clz) {
    const className = Object.keys(defined).find((definedName) => definedName === pascalCase(name))
    return defined[className]
  }
  return clz
}
