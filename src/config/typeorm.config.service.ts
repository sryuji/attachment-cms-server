import { Injectable } from '@nestjs/common'
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigService } from './config.service'
import ormconfig from '../../ormconfig'

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private config: ConfigService
  constructor(config: ConfigService) {
    this.config = config
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return this.getSQLiteOptions()
  }

  private getCommonOptions(): Record<string, unknown> {
    return {
      entities: ormconfig.entities,
      migrations: ormconfig.migrations,
      subscribers: ormconfig.subscribers,
      logging: ormconfig.logging,
      synchronize: ormconfig.synchronize,
    }
  }

  private getSQLiteOptions(): TypeOrmModuleOptions {
    return {
      ...ormconfig,
      ...this.getCommonOptions(),
    } as TypeOrmModuleOptions
  }
}
