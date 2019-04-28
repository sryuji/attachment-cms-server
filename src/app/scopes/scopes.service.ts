import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Scope } from '../../db/entity/scope.entity'
import { ScopeDto } from './dto'
import { BaseService } from '../base/base.service'

@Injectable()
export class ScopesService extends BaseService<Scope, ScopeDto> {
  constructor(
    @InjectRepository(Scope)
    private readonly repository: Repository<Scope>,
  ) {
    super(repository, Scope)
  }
}
