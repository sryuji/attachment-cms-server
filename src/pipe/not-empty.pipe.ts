import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common'

@Injectable()
export class NotEmptyPipe implements PipeTransform {
  async transform(value: string, metadata: ArgumentMetadata): Promise<any> {
    if (!value) {
      throw new BadRequestException()
    }
    return value
  }
}
