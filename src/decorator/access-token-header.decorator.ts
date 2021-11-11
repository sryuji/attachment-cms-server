import { applyDecorators, Header } from '@nestjs/common'

export function AccessTokenHeader(value: 'clear') {
  return applyDecorators(
    Header('X-Auth-AccessToken', value),
    Header('Access-Control-Expose-Headers', 'X-Auth-AccessToken')
  )
}
