import { SetMetadata } from '@nestjs/common'
import { Request } from 'express'

export type ScopeGetterHandler = (req: Request) => number | string | undefined | Promise<number | string | undefined>
export const SCOPE_GETTER_KEY = 'scope_getter'
export function ScopeGetter(getter: ScopeGetterHandler) {
  return SetMetadata(SCOPE_GETTER_KEY, getter)
}
