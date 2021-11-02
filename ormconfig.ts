import * as path from 'path'
import { BaseConnectionOptions } from 'typeorm/connection/BaseConnectionOptions'

const defaultConfig: Partial<BaseConnectionOptions> = {
  synchronize: false,
  logging: ['schema', 'error', 'warn'],
  entities: [path.resolve(__dirname, 'src/db/entity/**/*.entity.ts')],
  migrations: [path.resolve(__dirname, 'src/db/migration/*.ts')],
  subscribers: [path.resolve(__dirname, 'src/db/subscriber/**/*.subscriber.ts')],
  cli: {
    entitiesDir: 'src/db/entity',
    migrationsDir: 'src/db/migration',
    subscribersDir: 'src/db/subscriber',
  },
}
const developmentConfig = {
  type: 'sqlite',
  database: 'tmp/development.sqlite3',
  logging: 'all',
}
const testConfig = {
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  synchronize: true,
  logging: ['error', 'warn'],
}
const productionConfig = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 3306,
  username: process.env.DATABASE_USERNAME || 'acmsadmin',
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
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
