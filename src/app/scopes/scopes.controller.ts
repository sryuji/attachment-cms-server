import {
  Controller,
  Get,
  Body,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
  Patch,
  Param,
  Delete,
  HttpCode,
  ParseIntPipe,
  Query,
} from '@nestjs/common'
import { ScopesService } from './scopes.service'
import { ScopeDto } from './dto'
import { Pager } from '../base/pager'
import { ScopesSerializer } from './serializer/scopes.serializer'
import { ScopeSerializer } from './serializer/scope.serializer'
import { Like } from 'typeorm'

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ excludePrefixes: ['_'] })
@Controller('scopes(.json)?')
export class ScopesController {
  constructor(private readonly scopesService: ScopesService) {}

  @Post()
  async create(@Body('scope') dto: ScopeDto): Promise<ScopeSerializer> {
    const record = await this.scopesService.create(dto)
    return new ScopeSerializer(record)
  }

  @Patch(':id')
  async update(@Param('id', new ParseIntPipe()) id: number, @Body('scope') dto: ScopeDto): Promise<ScopeSerializer> {
    const record = await this.scopesService.update(id, dto)
    return new ScopeSerializer(record)
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    await this.scopesService.delete(id)
  }

  @Get()
  async findAll(@Query() query: any): Promise<ScopesSerializer> {
    // TODO: eager loadでdefaultReleaseを取得
    const [scopes, pager] = await this.scopesService.searchWithPager(new Pager(query), {
      where: query.domain && [{ domain: Like(`%${query.domain}%`) }, { testDomain: Like(`%${query.domain}%`) }],
      order: { id: 'DESC' },
      // relations: ['defaultRelease'],
    })
    return new ScopesSerializer({ scopes, pager })
  }

  @Get(':id')
  @SerializeOptions({ excludePrefixes: ['_'], groups: ['createdAt'] })
  async findOne(@Param('id', new ParseIntPipe()) id: number): Promise<ScopeSerializer> {
    const record = await this.scopesService.fetch(id)
    return new ScopeSerializer(record)
  }
}
