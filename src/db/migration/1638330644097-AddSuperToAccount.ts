import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSuperToAccount1638330644097 implements MigrationInterface {
    name = 'AddSuperToAccount1638330644097'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ADD "super" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "super"`);
    }

}
