import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Release } from '../../db/entity/release.entity'
import { ReleaseDto, PublishReleaseDto } from './dto/release.dto'
import { BaseService } from '../base/base.service'
import { Scope } from '@/src/db/entity/scope.entity'
import { ValidationsError } from '@/src/exception/validations.error'

@Injectable()
export class ReleasesService extends BaseService<Release, ReleaseDto> {
  constructor(
    @InjectRepository(Release)
    private readonly repository: Repository<Release>,
  ) {
    super(repository, Release)
  }

  async create(dto: Partial<Release>): Promise<Release> {
    const scope = await Scope.findOne(dto.scopeId)
    if (!scope) throw new ValidationsError([`Scopeが存在しません. scopeID: ${dto.scopeId}`])
    return await super.create(dto)
  }

  async publish(id: number, dto: PublishReleaseDto): Promise<Release> {
    return await this.basicRepository.manager.transaction(async manager => {
      const record = await this.update(id, dto)
      const scope = await record.scope
      scope.defaultReleaseId = record.id
      await scope.save()
      return record
    })
  }
}
