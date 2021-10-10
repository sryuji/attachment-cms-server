import { BaseSeed } from '../db/seed/base.seed'
import { loadClass } from '../util/file'
import { BaseCommand } from './base.command'
const env: string = process.env.NODE_ENV || 'development'

export default class SeedRunnerCommand extends BaseCommand {
  async perform(): Promise<void> {
    const names = process.argv.filter((_, i) => i > 2)
    if (!names || names.length === 0)
      console.error(`引数でentity nameをケバブケース(ex. content-history)で指定してください。`)

    names.forEach(async (name) => {
      const Seed: new () => BaseSeed = loadClass(`src/db/seed/${env}`, name, 'seed')
      await new Seed().run()
    })
  }
}
