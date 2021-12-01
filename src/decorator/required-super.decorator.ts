import { SetMetadata } from '@nestjs/common'

export const REQUIRED_SUPER = 'required-super'
export const RequiredSuper = () => SetMetadata(REQUIRED_SUPER, true)
