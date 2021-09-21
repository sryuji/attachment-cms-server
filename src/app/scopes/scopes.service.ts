import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, QueryFailedError } from 'typeorm'
import { Scope } from '../../db/entity/scope.entity'
import { BaseService } from '../base/base.service'
import { ReleaseRepository } from './repository/release.repository'

@Injectable()
export class ScopesService extends BaseService<Scope> {
  constructor(
    @InjectRepository(Scope)
    protected readonly repository: Repository<Scope>,
    private readonly releaseRepository: ReleaseRepository
  ) {
    super(repository, Scope)
  }

  async create(dto: Partial<Scope>): Promise<Scope> {
    return this.transaction(async (manager) => {
      const record = await super.create(dto)
      await this.releaseRepository.insert({ scopeId: record.id })
      return record
    })
  }
}
