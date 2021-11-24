import { ChildEntity } from 'typeorm'
import { ContentHistory } from './content-history.entity'

@ChildEntity()
export class ReleaseContentHistory extends ContentHistory {}
