import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from '../base/base.service'
import { ContentHistory } from '../../db/entity/content-history.entity'
import { Scope } from '../..//db/entity/scope.entity'
import { ReleaseRepository } from '../scopes/repository/release.repository'

@Injectable()
export class ContentsService extends BaseService<ContentHistory> {
  constructor(
    @InjectRepository(ContentHistory)
    protected readonly repository: Repository<ContentHistory>,
    @InjectRepository(Scope)
    private readonly scopeRepository: Repository<Scope>,
    private readonly releaseRepository: ReleaseRepository
  ) {
    super(repository, ContentHistory)
  }

  async searchLimitedReleaseTarget(limitedReleaseToken?: string): Promise<ContentHistory[]> {
    const release = await this.releaseRepository.findOne({ where: { limitedReleaseToken } })
    if (!release) throw new ForbiddenException('対象となるリリースが存在しません。')

    return this.findByRelease(release.id)
  }

  async searchReleaseTarget(token: string): Promise<ContentHistory[]> {
    const scope = await this.scopeRepository.findOne({ where: { token } })
    if (!scope) throw new UnauthorizedException()

    const release = await this.releaseRepository.findLatestRelease(scope.id, true)
    if (!release) throw new ForbiddenException('対象となるリリースが存在しません。')

    return this.findByRelease(release.id)
  }

  private findByRelease(releaseId: number) {
    return this.repository.find({
      where: { releaseId, inactive: false },
      order: { path: 'ASC', id: 'ASC' },
    })
  }
}
