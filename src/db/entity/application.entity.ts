import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'
import { Exclude } from 'class-transformer'

export abstract class ApplicationEntity<E> extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  @Exclude({ toPlainOnly: true })
  createdAt: Date

  @UpdateDateColumn()
  @Exclude({ toPlainOnly: true })
  updatedAt: Date

  constructor(attributes?: any) {
    super()
    // [ATTENTION] assignされるpropery、もしくは、setterが存在すること. 無いと、propertyが注入される
    // class-transformer#plainToClassを使うか検討したが、@Exposeされた値がassignされないので見送り
    // 厳密にやるには、property / setterのcheckが必要
    Object.assign(this, attributes)
  }

  /**
   * newで作ったばかりのid埋め込み時は、正しい判定できない
   */
  isNew() {
    return !!this.createdAt
  }
}
