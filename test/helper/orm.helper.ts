import { Provider } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type'
import { getManager } from 'typeorm'
import { ConfigModule } from '../../src/config/config.module'
import { TypeOrmConfigService } from '../../src/config/typeorm.config.service'
import { BaseSeed } from '../../src/db/seed/base.seed'

/**
 * TestModuleの生成をするHelper.
 * 他Moduleをimportしているケースは、Testでは個別にRepositoryをentityClassOrSchemaに、Serviceをproviderに指定すること
 *
 * @param entityClassOrSchema
 * @param providers
 * @returns
 */
export function compileModule(entityClassOrSchema: EntityClassOrSchema[], providers: Provider[] = []) {
  return Test.createTestingModule({
    imports: [
      ConfigModule,
      TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
      TypeOrmModule.forFeature(entityClassOrSchema),
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
