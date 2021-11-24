export const PluginFileKind = {
  js: 'js',
  css: 'css',
} as const
export type PluginFileKindType = typeof PluginFileKind[keyof typeof PluginFileKind]
