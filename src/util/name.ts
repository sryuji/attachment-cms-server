export function camelCase(str: string): string {
  str = str.charAt(0).toLowerCase() + str.slice(1)
  return str.replace(/[-_](.)/g, (_match, group1) => {
    return group1.toUpperCase()
  })
}

export function kebabCase(str: string): string {
  const camel = camelCase(str)
  return camel.replace(/[A-Z]/g, s => {
    return '-' + s.charAt(0).toLowerCase()
  })
}

export function pascalCase(str: string): string {
  const camel = camelCase(str)
  return camel.charAt(0).toUpperCase() + camel.slice(1)
}
