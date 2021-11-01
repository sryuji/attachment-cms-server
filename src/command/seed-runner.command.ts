import { getManager } from 'typeorm'
import { BaseSeed } from '../db/seed/base.seed'
import { loadClass } from '../util/file'
import { BaseCommand } from './base.command'
const env: string = process.env.NODE_ENV || 'development'

export default class SeedRunnerCommand extends BaseCommand {
  async perform(): Promise<void> {
    const names = process.argv.filter((_, i) => i > 2)
    if (!names || names.length === 0)
      console.error(`引数でentity nameをケバブケース(ex. content-history)で指定してください。`)

    await getManager().transaction(async (manager) => {
      // NOTE: `names.forEach(async (name) => {` 記述だと、それぞれのPromiseが同時実行されてしまうため、forを利用
      for (const name of names) {
        const Seed: new () => BaseSeed = loadClass(`src/db/seed/${env}`, name, 'seed')
        console.log(`run ${name} Seed`)
        await new Seed().run()
      }
    })
  }
}
