import { Column, Entity, Index, OneToMany, OneToOne } from 'typeorm'
import { ApplicationEntity } from './application.entity'
import { IsNumber } from 'class-validator'
import { PluginFile } from './plugin-file.entity'
import { PluginContentHistory } from './plugin-content-history.entity'

@Entity()
export class Plugin extends ApplicationEntity<Plugin> {
  @Column({ nullable: false })
  @IsNumber()
  @Index()
  scopeId: number

  @Column({ nullable: false })
  @IsNumber()
  @Index()
  contentHistoryId: number

  @OneToOne((type) => PluginContentHistory, (r) => r.plugin)
  contentHistory: PluginContentHistory

  @Column({ nullable: false })
  name: string

  @OneToMany((type) => PluginFile, (r) => r.plugin)
  pluginFiles: PluginFile[]
}
