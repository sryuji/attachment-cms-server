import { Injectable } from '@nestjs/common'
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigService } from './config.service'
import * as path from 'path'

const ENTITY_PATH = [path.resolve(__dirname, '../db/entity/**/*.entity.ts')]
const MIGRATION_PATH = [path.resolve(__dirname, '../db/migration/**/*.migration.ts')]
const SUBSCRIBER_PATH = [path.resolve(__dirname, '../db/subscriber/**/*.subscriber.ts')]

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private config: ConfigService
  constructor(config: ConfigService) {
    this.config = config
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return this.getSQLiteOptions()
  }

  private getCommonOptions(): object {
    return {
      entities: ENTITY_PATH,
      migrations: MIGRATION_PATH,
      subscribers: SUBSCRIBER_PATH,
      logging: this.config.getBoolean('ORM_LOGGING'),
      synchronize: this.config.getBoolean('ORM_SYNCHRONIZE'),
    }
  }

  private getSQLiteOptions(): TypeOrmModuleOptions {
    return {
      type: 'sqlite',
      database: this.config.getString('DATABASE') || 'tmp/development.sqlite3',
      ...this.getCommonOptions(),
    }
  }
}
