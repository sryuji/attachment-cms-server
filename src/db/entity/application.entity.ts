import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'
import { Exclude } from 'class-transformer'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export abstract class ApplicationEntity<E> extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  @Exclude({ toPlainOnly: true })
  createdAt: Date

  @UpdateDateColumn()
  @Exclude({ toPlainOnly: true })
  updatedAt: Date

  constructor(attributes?: unknown) {
    super()
    Object.assign(this, attributes)
  }

  isNew() {
    return !!this.createdAt
  }
}
