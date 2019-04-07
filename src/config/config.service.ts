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
    this.numberRegExp = new RegExp(/^[-+]?[0-9]+(\.[0-9]+)?$/)
  }

  getString(key: string): string {
    return this.envConfig[key]
  }

  getBoolean(key: string): boolean {
    return this.envConfig[key] === 'true'
  }

  getNumber(key: string): Number {
    const v = this.envConfig[key]
    if (v === null || v === '') return null
    return Number(v)
  }

  get isDev(): boolean {
    return Boolean(this.envConfig.NODE_ENV === 'development')
  }
}
