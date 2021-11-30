import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddIsUpdatedToContentHistory1638266362018 implements MigrationInterface {
  name = 'AddIsUpdatedToContentHistory1638266362018'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "content_history" ADD "isUpdated" boolean NOT NULL DEFAULT false`)
    queryRunner.query(`UPDATE content_history SET "isUpdated" = true WHERE "createdAt" != "updatedAt"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "content_history" DROP COLUMN "isUpdated"`)
  }
}
