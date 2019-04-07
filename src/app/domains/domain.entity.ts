import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Domain {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 255 })
  name: string

  @Column('text')
  description: string
}
