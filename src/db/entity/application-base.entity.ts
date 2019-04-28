import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'
import { Exclude } from 'class-transformer'

export abstract class ApplicationBaseEntity<E> extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  @Exclude({ toPlainOnly: true })
  createdAt: Date

  @UpdateDateColumn()
  @Exclude({ toPlainOnly: true })
  updatedAt: Date

  constructor(attributes?: Partial<E>) {
    super()
    Object.assign(this, attributes)
  }
}
