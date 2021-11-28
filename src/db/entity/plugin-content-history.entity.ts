import { IsNumber } from 'class-validator'
import { ChildEntity, Column, Index } from 'typeorm'
import { ContentHistory } from './content-history.entity'

@ChildEntity()
export class PluginContentHistory extends ContentHistory {
  constructor(attributes?: unknown) {
    super(attributes)
    this.initialize()
  }

  initialize() {
    this.selector = 'body'
    this.action = 'insertChildBeforeEnd'
  }

  @Column({ nullable: false })
  @IsNumber()
  @Index()
  pluginId: number
}
