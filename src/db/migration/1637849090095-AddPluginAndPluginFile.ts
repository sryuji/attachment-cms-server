import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPluginAndPluginFile1637849090095 implements MigrationInterface {
    name = 'AddPluginAndPluginFile1637849090095'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "plugin" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "content" text, CONSTRAINT "PK_9a65387180b2e67287345684c03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plugin_file" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "pluginId" integer NOT NULL, "kind" character varying NOT NULL, "url" character varying NOT NULL, CONSTRAINT "PK_88ec59b2caee93d2dd9378a5775" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5bf8cc4798b90d5d3c88ac246e" ON "plugin_file" ("pluginId") `);
        await queryRunner.query(`ALTER TABLE "content_history" ADD "type" character varying(64) NOT NULL DEFAULT 'ReleaseContentHistory'`);
        await queryRunner.query(`ALTER TABLE "content_history" ADD "pluginId" integer`);
        await queryRunner.query(`ALTER TABLE "content_history" DROP CONSTRAINT "FK_a431a2b1b4b5b1fe9f15e77615b"`);
        await queryRunner.query(`ALTER TABLE "content_history" ALTER COLUMN "releaseId" DROP NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_8963216c4cb9aa14d5dcf88185" ON "content_history" ("pluginId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0986291de179e3b2ac7b4e9520" ON "content_history" ("type") `);
        await queryRunner.query(`ALTER TABLE "content_history" ADD CONSTRAINT "FK_a431a2b1b4b5b1fe9f15e77615b" FOREIGN KEY ("releaseId") REFERENCES "release"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plugin_file" ADD CONSTRAINT "FK_5bf8cc4798b90d5d3c88ac246e1" FOREIGN KEY ("pluginId") REFERENCES "plugin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plugin_file" DROP CONSTRAINT "FK_5bf8cc4798b90d5d3c88ac246e1"`);
        await queryRunner.query(`ALTER TABLE "content_history" DROP CONSTRAINT "FK_a431a2b1b4b5b1fe9f15e77615b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0986291de179e3b2ac7b4e9520"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8963216c4cb9aa14d5dcf88185"`);
        await queryRunner.query(`ALTER TABLE "content_history" ALTER COLUMN "releaseId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "content_history" ADD CONSTRAINT "FK_a431a2b1b4b5b1fe9f15e77615b" FOREIGN KEY ("releaseId") REFERENCES "release"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "content_history" DROP COLUMN "pluginId"`);
        await queryRunner.query(`ALTER TABLE "content_history" DROP COLUMN "type"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5bf8cc4798b90d5d3c88ac246e"`);
        await queryRunner.query(`DROP TABLE "plugin_file"`);
        await queryRunner.query(`DROP TABLE "plugin"`);
    }

}
