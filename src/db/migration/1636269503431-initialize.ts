import {MigrationInterface, QueryRunner} from "typeorm";

export class initialize1636269503431 implements MigrationInterface {
    name = 'initialize1636269503431'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "account" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "lastName" character varying(64), "firstName" character varying(64), "avatarUrl" character varying, "jwtRefreshToken" character varying, "jwtRefreshTokenIssuedAt" TIMESTAMP, "googleAccessToken" character varying, "googleRefreshToken" character varying, "authenticatedAt" TIMESTAMP, CONSTRAINT "UQ_e1c69664a17457849a4c43cfcef" UNIQUE ("jwtRefreshToken"), CONSTRAINT "UQ_4c8f96ccf523e9a3faefd5bdd4c" UNIQUE ("email"), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "content_history" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "scopeId" integer NOT NULL, "releaseId" integer NOT NULL, "path" character varying NOT NULL, "description" character varying, "selector" text, "content" text, "action" character varying, "inactive" boolean NOT NULL DEFAULT false, "sourceContentHistoryId" integer, CONSTRAINT "PK_d37f5f01b012412c6230f8c1f0b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bded2e3ba0d5e4c76ed8cd9f7b" ON "content_history" ("scopeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a431a2b1b4b5b1fe9f15e77615" ON "content_history" ("releaseId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e7201e07b3414aa676857c0ebf" ON "content_history" ("sourceContentHistoryId") `);
        await queryRunner.query(`CREATE TABLE "release" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "scopeId" integer NOT NULL, "name" character varying NOT NULL, "limitedReleaseToken" character varying(255), "limitedReleaseTokenIssuedAt" TIMESTAMP, "releasedAt" TIMESTAMP, "rollbackedAt" TIMESTAMP, "sourceReleaseId" integer, CONSTRAINT "UQ_5911a19c1403a769c044c141413" UNIQUE ("limitedReleaseToken"), CONSTRAINT "PK_1a2253436964eea9c558f9464f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fa7c49ba5fb106c6cd9f7519cc" ON "release" ("scopeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_38b13deb9be7cb6a2e8af4ca69" ON "release" ("sourceReleaseId") `);
        await queryRunner.query(`CREATE TABLE "scope" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "domain" character varying(255), "description" text, "token" character varying(255) NOT NULL, "defaultReleaseId" integer, CONSTRAINT "UQ_a168d00d3432bab2cb122c83981" UNIQUE ("token"), CONSTRAINT "REL_a86075db6f83ca160b07fb9f73" UNIQUE ("defaultReleaseId"), CONSTRAINT "PK_d3425631cbb370861a58c3e88c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "account_scope" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "accountId" integer NOT NULL, "scopeId" integer NOT NULL, CONSTRAINT "PK_e48d81358d86c63f954bc498940" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6a899fcb3f7b560ae9a8a36ece" ON "account_scope" ("accountId", "scopeId") `);
        await queryRunner.query(`ALTER TABLE "content_history" ADD CONSTRAINT "FK_bded2e3ba0d5e4c76ed8cd9f7bb" FOREIGN KEY ("scopeId") REFERENCES "scope"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "content_history" ADD CONSTRAINT "FK_a431a2b1b4b5b1fe9f15e77615b" FOREIGN KEY ("releaseId") REFERENCES "release"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "release" ADD CONSTRAINT "FK_fa7c49ba5fb106c6cd9f7519cca" FOREIGN KEY ("scopeId") REFERENCES "scope"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scope" ADD CONSTRAINT "FK_a86075db6f83ca160b07fb9f73a" FOREIGN KEY ("defaultReleaseId") REFERENCES "release"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account_scope" ADD CONSTRAINT "FK_bcd612bd76bc51820a9ead87f70" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account_scope" ADD CONSTRAINT "FK_d563a8542d949344519634a8f80" FOREIGN KEY ("scopeId") REFERENCES "scope"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_scope" DROP CONSTRAINT "FK_d563a8542d949344519634a8f80"`);
        await queryRunner.query(`ALTER TABLE "account_scope" DROP CONSTRAINT "FK_bcd612bd76bc51820a9ead87f70"`);
        await queryRunner.query(`ALTER TABLE "scope" DROP CONSTRAINT "FK_a86075db6f83ca160b07fb9f73a"`);
        await queryRunner.query(`ALTER TABLE "release" DROP CONSTRAINT "FK_fa7c49ba5fb106c6cd9f7519cca"`);
        await queryRunner.query(`ALTER TABLE "content_history" DROP CONSTRAINT "FK_a431a2b1b4b5b1fe9f15e77615b"`);
        await queryRunner.query(`ALTER TABLE "content_history" DROP CONSTRAINT "FK_bded2e3ba0d5e4c76ed8cd9f7bb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a899fcb3f7b560ae9a8a36ece"`);
        await queryRunner.query(`DROP TABLE "account_scope"`);
        await queryRunner.query(`DROP TABLE "scope"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_38b13deb9be7cb6a2e8af4ca69"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fa7c49ba5fb106c6cd9f7519cc"`);
        await queryRunner.query(`DROP TABLE "release"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e7201e07b3414aa676857c0ebf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a431a2b1b4b5b1fe9f15e77615"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bded2e3ba0d5e4c76ed8cd9f7b"`);
        await queryRunner.query(`DROP TABLE "content_history"`);
        await queryRunner.query(`DROP TABLE "account"`);
    }

}
