import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'
import { parseDocument } from 'htmlparser2'

export function IsOneRootNode(validationOptions: ValidationOptions = {}): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsOneRootNode',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          if (!value) return true
          if (typeof value !== 'string') return false
          try {
            const document = parseDocument(value)
            if (document.childNodes.length !== 1) return false
            return true
          } catch (err) {
            return false
          }
        },

        defaultMessage(validationArguments?: ValidationArguments): string {
          return 'HTMLタグの利用する場合、ルート要素が１つになるように<div>や<span>タグなどで囲んでください。'
        },
      },
    })
  }
}
