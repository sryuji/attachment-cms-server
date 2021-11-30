import { IsIn } from 'class-validator'
import { Column, Entity, Index, ManyToOne } from 'typeorm'
import { PluginFileKind } from '../../enum/plugin-file-kind.enum'
import { ApplicationEntity } from './application.entity'
import { Plugin } from './plugin.entity'

@Entity()
export class PluginFile extends ApplicationEntity<PluginFile> {
  @Column({ nullable: false })
  @Index()
  pluginId: number

  @ManyToOne((type) => Plugin, (r) => r.pluginFiles)
  plugin: Plugin

  @Column({ nullable: false })
  @IsIn(Object.values(PluginFileKind))
  kind: string

  @Column({ nullable: false })
  url: string
}
