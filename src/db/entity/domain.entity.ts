import { Column, Entity } from 'typeorm'
import { ApplicationBaseEntity } from './application-base.entity'

@Entity()
export class Domain extends ApplicationBaseEntity {
  @Column({ length: 255 })
  name: string

  @Column('text')
  description: string
}
