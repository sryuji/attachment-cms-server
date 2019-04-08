import { Controller, Get } from '@nestjs/common'
import { DomainsService } from './domains.service'
import { Domain } from '../../db/entity/domain.entity'

@Controller('domains')
export class DomainsController {
  constructor(private readonly domainsService: DomainsService) {}

  @Get()
  findAll(): Promise<Domain[]> {
    return this.domainsService.findAll()
  }
}
