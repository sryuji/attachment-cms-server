import { Column, Entity, OneToMany } from 'typeorm'
import { ApplicationEntity } from './application.entity'
import { PluginFile } from './plugin-file.entity'

@Entity()
export class Plugin extends ApplicationEntity<Plugin> {
  @Column({ nullable: false })
  name: string

  @Column('text', { nullable: true })
  content: string

  @OneToMany((type) => PluginFile, (r) => r.plugin)
  pluginFiles: PluginFile[]
}
