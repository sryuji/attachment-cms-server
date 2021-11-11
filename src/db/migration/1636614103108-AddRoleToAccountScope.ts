import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRoleToAccountScope1636614103108 implements MigrationInterface {
    name = 'AddRoleToAccountScope1636614103108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_scope" ADD "role" character varying NOT NULL DEFAULT 'member'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_scope" DROP COLUMN "role"`);
    }

}
