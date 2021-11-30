import * as path from 'path'
import { BaseConnectionOptions } from 'typeorm/connection/BaseConnectionOptions'

const defaultConfig: Partial<BaseConnectionOptions> = {
  synchronize: false,
  logging: ['schema', 'error', 'warn'],
  entities: [path.resolve(__dirname, 'src/db/entity/**/*.entity.*')],
  migrations: [path.resolve(__dirname, 'src/db/migration/*')],
  subscribers: [path.resolve(__dirname, 'src/db/subscriber/**/*.subscriber.*')],
  cli: {
    entitiesDir: 'src/db/entity',
    migrationsDir: 'src/db/migration',
    subscribersDir: 'src/db/subscriber',
  },
}
const developmentConfig = {
  type: 'postgres',
  host: 'acms_db',
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  logging: 'all',
}
const testConfig = {
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  synchronize: true,
  logging: process.env.JEST_DEBUG ? 'all' : ['error', 'warn'],
}
const productionConfig = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: ['schema', 'error', 'warn'],
}

function pickEnvironmentConfig() {
  switch (process.env.NODE_ENV) {
    case 'test':
      return testConfig
    case 'production':
      return productionConfig
    default:
      return developmentConfig
  }
}

const config = { ...defaultConfig, ...pickEnvironmentConfig() }
export default config
