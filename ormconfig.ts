/**
 * WARNING: yarn run typeorm schema:xxx時のみ使われる. app側はconfigService経由でenvから値を取って接続している
 */
const defaultConfig = {
  synchronize: false,
  logging: false,
  entities: ['src/db/entity/**/*.entity.ts'],
  migrations: ['src/db/migration/*.ts'],
  subscribers: ['src/db/subscriber/**/*.subscriber.ts'],
  cli: {
    entitiesDir: 'src/db/entity',
    migrationsDir: 'src/db/migration',
    subscribersDir: 'src/db/subscriber',
  },
}
const developmentConfig = {
  type: 'sqlite',
  database: 'tmp/development.sqlite3',
  logging: true,
}
const testConfig = {
  type: 'sqlite',
  database: 'tmp/test.sqlite3',
  logging: true,
}
const productionConfig = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT || 3306,
  username: process.env.DATABASE_USERNAME || 'acmsadmin',
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  logging: false,
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
