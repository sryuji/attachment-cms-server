import * as dotenv from 'dotenv'
import * as fs from 'fs'
const env: string = process.env.NODE_ENV || 'development'

export class ConfigService {
  private readonly envConfig: { [key: string]: string }
  private readonly numberRegExp: RegExp

  constructor() {
    const def = dotenv.parse(fs.readFileSync('env/default.env'))
    this.envConfig = {
      ...def,
      ...dotenv.parse(fs.readFileSync(`env/${env}.env`)),
    }
    Object.keys(this.envConfig).forEach((key) => {
      const v = process.env[key]
      if (v) this.envConfig[key] = v
    })
    this.numberRegExp = new RegExp(/^[-+]?[0-9]+(\.[0-9]+)?$/)
  }

  getString(key: string, required?: boolean): string {
    const v = this.envConfig[key]
    if (!v && required) throw new Error(`Configuration Error. ${key} is empty.`)
    return v
  }

  getBoolean(key: string): boolean {
    return this.envConfig[key] === 'true'
  }

  getNumber(key: string, required?: boolean): number {
    const v = this.envConfig[key]
    if (v === null || v === '') {
      if (required) throw new Error(`Configuration Error. ${key} is empty.`)
      return null
    }
    return Number(v)
  }

  get isDev(): boolean {
    return Boolean(this.envConfig.NODE_ENV === 'development')
  }

  get isTest(): boolean {
    return Boolean(this.envConfig.NODE_ENV === 'test')
  }

  get isProduction(): boolean {
    return Boolean(this.envConfig.NODE_ENV === 'production')
  }
}
