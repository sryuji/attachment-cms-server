import { ArgumentMetadata, BadRequestException, ValidationPipe } from '@nestjs/common'
import { IsOneRootNode } from './one-root-node.validation'

class TestDto {
  @IsOneRootNode()
  content: string
}

describe('IsOneRootNode', () => {
  const metadata: ArgumentMetadata = {
    type: 'body',
    metatype: TestDto,
  }

  describe('valid', () => {
    it('valids when no text', async () => {
      const model = { content: '' }
      const target = new ValidationPipe()
      expect(await target.transform(model, metadata)).not.toBeInstanceOf(TestDto)
    })

    it('valids when null', async () => {
      const model = { content: null as string }
      const target = new ValidationPipe()
      expect(await target.transform(model, metadata)).not.toBeInstanceOf(TestDto)
    })

    it('valids when only text content', async () => {
      const model = { content: 'テキストのみ' }
      const target = new ValidationPipe()
      expect(await target.transform(model, metadata)).not.toBeInstanceOf(TestDto)
    })

    it('valids but invalid html tag. Beacause no check html format.', async () => {
      const model = { content: '<di>test</di>' }
      const target = new ValidationPipe()
      expect(target.transform(model, metadata)).not.toBeInstanceOf(TestDto)
    })
  })

  describe('要検討な動作', () => {
    // TODO: htmlタグのforma checkはしてない。html format checkまでするとnpm含め重いので...
    it('valids but Nothing closed tag', async () => {
      const model = { content: '<div>test' }
      const target = new ValidationPipe()
      expect(target.transform(model, metadata)).not.toBeInstanceOf(TestDto)
    })

    it('valids but Nothing start tag. </div> is considered as text', async () => {
      const model = { content: 'test</div>' }
      const target = new ValidationPipe()
      expect(target.transform(model, metadata)).not.toBeInstanceOf(TestDto)
    })
  })

  describe('fails', () => {
    it('fails when 2 root node', async () => {
      const model = { content: '<div>test</div><div>test2</div>' }
      const target = new ValidationPipe()
      return expect(target.transform(model, metadata)).rejects.toThrowError(BadRequestException)
    })

    it('fails. html, but no setting root html node.', async () => {
      const model = { content: 'テキストだけ<span>じゃないが</span>、埋もれている感じ' }
      const target = new ValidationPipe()
      return expect(target.transform(model, metadata)).rejects.toThrowError(BadRequestException)
    })
  })
})
