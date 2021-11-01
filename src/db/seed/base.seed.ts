/* eslint-disable @typescript-eslint/no-explicit-any */
import { getManager, getRepository } from 'typeorm'

export abstract class BaseSeed {
  async run(): Promise<void> {
    await getManager().transaction(async (manager) => {
      await this.perform()
    })
  }
  abstract perform(): Promise<void>

  async createOrUpdate(seedList: any[], type: new (attributes?: any) => any, uniqueKeys: string[]) {
    const promiseList = seedList.map(async (r: any) => {
      const query = uniqueKeys.reduce((result, key) => {
        result[key] = r[key]
        return result
      }, {} as any)
      const record = await getRepository(type).findOne(query)
      if (!record) return new type(r)
      return Object.assign(record, r)
    })
    const collection = await Promise.all(promiseList)
    await getManager().save(collection)
  }
}
