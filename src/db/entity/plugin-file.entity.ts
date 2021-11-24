import { Column, Entity, Index, ManyToOne } from 'typeorm'
import { ApplicationEntity } from './application.entity'
import { IsNumber } from 'class-validator'
import { Plugin } from './plugin.entity'

@Entity()
export class PluginFile extends ApplicationEntity<PluginFile> {
  @Column({ nullable: false })
  @IsNumber()
  @Index()
  pluginId: number

  @ManyToOne((type) => Plugin, (r) => r.pluginFiles)
  plugin: Plugin

  @Column({ nullable: false })
  kind: string

  @Column({ nullable: false })
  url: string
}
