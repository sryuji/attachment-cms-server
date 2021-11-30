import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm'
import { Exclude } from 'class-transformer'
import { validate } from 'class-validator'
import { ValidationsError } from '../../exception/validations.error'

const isProduction = process.env.NODE_ENV === 'production'

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

  /**
   * TableのNullableやUniqueでCheckしきれないものをvalidationする
   * 入力チェックはform/dto側で行うこと
   * データ構造のBug検出のために利用する。schema定義でcheckできるものは、schema定義 (nullable, unique)で行う
   *
   * 主な利用は、STIのクラス別データ構造、enum etc..
   */
  @BeforeInsert()
  @BeforeUpdate()
  async validateEntity() {
    const errors = await validate(this)
    if (errors && errors.length > 0) {
      const e = new ValidationsError(errors)
      if (!isProduction) console.error(e.getMessages())
      throw e
    }
  }
}
