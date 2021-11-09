import {MigrationInterface, QueryRunner} from "typeorm";

export class AddScopeInvitation1636372770677 implements MigrationInterface {
    name = 'AddScopeInvitation1636372770677'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "scope_invitation" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "scopeId" integer NOT NULL, "invitationToken" character varying, "joinedAt" TIMESTAMP, CONSTRAINT "UQ_da63146c81ea4fdb86b07b206c5" UNIQUE ("invitationToken"), CONSTRAINT "PK_a6a2cd34bdc9d1418da98d111bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_52cbd3ea20444ed2bf75336a99" ON "scope_invitation" ("scopeId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_52cbd3ea20444ed2bf75336a99"`);
        await queryRunner.query(`DROP TABLE "scope_invitation"`);
    }

}
