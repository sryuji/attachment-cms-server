import {MigrationInterface, QueryRunner} from "typeorm";

export class initialize1556614659997 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "scope" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar(255), "domain" varchar(255) NOT NULL, "testDomain" varchar(255), "description" text, "defaultReleaseId" integer, CONSTRAINT "REL_a86075db6f83ca160b07fb9f73" UNIQUE ("defaultReleaseId"))`);
        await queryRunner.query(`CREATE TABLE "release" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "scopeId" integer NOT NULL, "limitedReleaseToken" varchar(255), "limitedReleaseTokenIssuedAt" datetime, "releasedAt" datetime, "rollbackedAt" datetime, "sourceReleaseId" integer)`);
        await queryRunner.query(`CREATE TABLE "content_history" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "scopeId" integer NOT NULL, "releaseId" integer NOT NULL, "path" varchar NOT NULL, "selector" text, "content" text, "action" varchar, "inactive" boolean NOT NULL DEFAULT (0), "sourceContentHistoryId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_scope" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar(255), "domain" varchar(255) NOT NULL, "testDomain" varchar(255), "description" text, "defaultReleaseId" integer, CONSTRAINT "REL_a86075db6f83ca160b07fb9f73" UNIQUE ("defaultReleaseId"), CONSTRAINT "FK_a86075db6f83ca160b07fb9f73a" FOREIGN KEY ("defaultReleaseId") REFERENCES "release" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_scope"("id", "createdAt", "updatedAt", "name", "domain", "testDomain", "description", "defaultReleaseId") SELECT "id", "createdAt", "updatedAt", "name", "domain", "testDomain", "description", "defaultReleaseId" FROM "scope"`);
        await queryRunner.query(`DROP TABLE "scope"`);
        await queryRunner.query(`ALTER TABLE "temporary_scope" RENAME TO "scope"`);
        await queryRunner.query(`CREATE TABLE "temporary_release" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "scopeId" integer NOT NULL, "limitedReleaseToken" varchar(255), "limitedReleaseTokenIssuedAt" datetime, "releasedAt" datetime, "rollbackedAt" datetime, "sourceReleaseId" integer, CONSTRAINT "FK_fa7c49ba5fb106c6cd9f7519cca" FOREIGN KEY ("scopeId") REFERENCES "scope" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_release"("id", "createdAt", "updatedAt", "scopeId", "limitedReleaseToken", "limitedReleaseTokenIssuedAt", "releasedAt", "rollbackedAt", "sourceReleaseId") SELECT "id", "createdAt", "updatedAt", "scopeId", "limitedReleaseToken", "limitedReleaseTokenIssuedAt", "releasedAt", "rollbackedAt", "sourceReleaseId" FROM "release"`);
        await queryRunner.query(`DROP TABLE "release"`);
        await queryRunner.query(`ALTER TABLE "temporary_release" RENAME TO "release"`);
        await queryRunner.query(`CREATE TABLE "temporary_content_history" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "scopeId" integer NOT NULL, "releaseId" integer NOT NULL, "path" varchar NOT NULL, "selector" text, "content" text, "action" varchar, "inactive" boolean NOT NULL DEFAULT (0), "sourceContentHistoryId" integer, CONSTRAINT "FK_bded2e3ba0d5e4c76ed8cd9f7bb" FOREIGN KEY ("scopeId") REFERENCES "scope" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_a431a2b1b4b5b1fe9f15e77615b" FOREIGN KEY ("releaseId") REFERENCES "release" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_e7201e07b3414aa676857c0ebff" FOREIGN KEY ("sourceContentHistoryId") REFERENCES "content_history" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_content_history"("id", "createdAt", "updatedAt", "scopeId", "releaseId", "path", "selector", "content", "action", "inactive", "sourceContentHistoryId") SELECT "id", "createdAt", "updatedAt", "scopeId", "releaseId", "path", "selector", "content", "action", "inactive", "sourceContentHistoryId" FROM "content_history"`);
        await queryRunner.query(`DROP TABLE "content_history"`);
        await queryRunner.query(`ALTER TABLE "temporary_content_history" RENAME TO "content_history"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "content_history" RENAME TO "temporary_content_history"`);
        await queryRunner.query(`CREATE TABLE "content_history" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "scopeId" integer NOT NULL, "releaseId" integer NOT NULL, "path" varchar NOT NULL, "selector" text, "content" text, "action" varchar, "inactive" boolean NOT NULL DEFAULT (0), "sourceContentHistoryId" integer)`);
        await queryRunner.query(`INSERT INTO "content_history"("id", "createdAt", "updatedAt", "scopeId", "releaseId", "path", "selector", "content", "action", "inactive", "sourceContentHistoryId") SELECT "id", "createdAt", "updatedAt", "scopeId", "releaseId", "path", "selector", "content", "action", "inactive", "sourceContentHistoryId" FROM "temporary_content_history"`);
        await queryRunner.query(`DROP TABLE "temporary_content_history"`);
        await queryRunner.query(`ALTER TABLE "release" RENAME TO "temporary_release"`);
        await queryRunner.query(`CREATE TABLE "release" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "scopeId" integer NOT NULL, "limitedReleaseToken" varchar(255), "limitedReleaseTokenIssuedAt" datetime, "releasedAt" datetime, "rollbackedAt" datetime, "sourceReleaseId" integer)`);
        await queryRunner.query(`INSERT INTO "release"("id", "createdAt", "updatedAt", "scopeId", "limitedReleaseToken", "limitedReleaseTokenIssuedAt", "releasedAt", "rollbackedAt", "sourceReleaseId") SELECT "id", "createdAt", "updatedAt", "scopeId", "limitedReleaseToken", "limitedReleaseTokenIssuedAt", "releasedAt", "rollbackedAt", "sourceReleaseId" FROM "temporary_release"`);
        await queryRunner.query(`DROP TABLE "temporary_release"`);
        await queryRunner.query(`ALTER TABLE "scope" RENAME TO "temporary_scope"`);
        await queryRunner.query(`CREATE TABLE "scope" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar(255), "domain" varchar(255) NOT NULL, "testDomain" varchar(255), "description" text, "defaultReleaseId" integer, CONSTRAINT "REL_a86075db6f83ca160b07fb9f73" UNIQUE ("defaultReleaseId"))`);
        await queryRunner.query(`INSERT INTO "scope"("id", "createdAt", "updatedAt", "name", "domain", "testDomain", "description", "defaultReleaseId") SELECT "id", "createdAt", "updatedAt", "name", "domain", "testDomain", "description", "defaultReleaseId" FROM "temporary_scope"`);
        await queryRunner.query(`DROP TABLE "temporary_scope"`);
        await queryRunner.query(`DROP TABLE "content_history"`);
        await queryRunner.query(`DROP TABLE "release"`);
        await queryRunner.query(`DROP TABLE "scope"`);
    }

}
