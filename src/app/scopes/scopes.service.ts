import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Scope } from '../../db/entity/scope.entity'
import { BaseService } from '../base/base.service'

@Injectable()
export class ScopesService extends BaseService<Scope> {
  constructor(
    @InjectRepository(Scope)
    protected readonly repository: Repository<Scope>,
  ) {
    super(repository, Scope)
  }
}
