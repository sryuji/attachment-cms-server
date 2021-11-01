import { DynamicModule, ForwardReference, Provider, Type } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type'
import { getManager } from 'typeorm'
import { ConfigModule } from '../../src/config/config.module'
import { TypeOrmConfigService } from '../../src/config/typeorm.config.service'
import { BaseSeed } from '../../src/db/seed/base.seed'

type ImportType = Type | DynamicModule | Promise<DynamicModule> | ForwardReference

export function compileModule(
  entityClassOrSchema: EntityClassOrSchema[],
  providers: Provider[],
  ...modules: ImportType[]
) {
  return Test.createTestingModule({
    imports: [
      ConfigModule,
      TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
      TypeOrmModule.forFeature(entityClassOrSchema),
      ...modules,
    ],
    providers: providers,
  }).compile()
}

export async function runSeeds(...seeds: (new () => BaseSeed)[]) {
  await getManager().transaction(async (manager) => {
    for (const seed of seeds) {
      await new seed().run()
    }
  })
}
