import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, QueryFailedError } from 'typeorm'
import { Scope } from '../../db/entity/scope.entity'
import { BaseService } from '../base/base.service'
import { ValidationsError } from 'src/exception/validations.error'

@Injectable()
export class ScopesService extends BaseService<Scope> {
  constructor(
    @InjectRepository(Scope)
    protected readonly repository: Repository<Scope>,
  ) {
    super(repository, Scope)
  }

  async create(dto: any): Promise<Scope> {
    return super.create(dto).catch(e => {
      if (e instanceof QueryFailedError) throw new ValidationsError(['tokenが重複しました。再実行してください'])
      throw e
    })
  }
}
