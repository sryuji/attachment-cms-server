import {MigrationInterface, QueryRunner} from "typeorm";

export class changeContentHistory1635395681440 implements MigrationInterface {
    name = 'changeContentHistory1635395681440'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_content_history" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "scopeId" integer NOT NULL, "releaseId" integer NOT NULL, "path" varchar NOT NULL, "selector" text, "content" text, "action" varchar, "inactive" boolean NOT NULL DEFAULT (0), "sourceContentHistoryId" integer NOT NULL, CONSTRAINT "FK_a431a2b1b4b5b1fe9f15e77615b" FOREIGN KEY ("releaseId") REFERENCES "release" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_bded2e3ba0d5e4c76ed8cd9f7bb" FOREIGN KEY ("scopeId") REFERENCES "scope" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_content_history"("id", "createdAt", "updatedAt", "scopeId", "releaseId", "path", "selector", "content", "action", "inactive", "sourceContentHistoryId") SELECT "id", "createdAt", "updatedAt", "scopeId", "releaseId", "path", "selector", "content", "action", "inactive", "sourceContentHistoryId" FROM "content_history"`);
        await queryRunner.query(`DROP TABLE "content_history"`);
        await queryRunner.query(`ALTER TABLE "temporary_content_history" RENAME TO "content_history"`);
        await queryRunner.query(`CREATE TABLE "temporary_content_history" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "scopeId" integer NOT NULL, "releaseId" integer NOT NULL, "path" varchar NOT NULL, "selector" text, "content" text, "action" varchar, "inactive" boolean NOT NULL DEFAULT (0), "sourceContentHistoryId" integer, CONSTRAINT "FK_a431a2b1b4b5b1fe9f15e77615b" FOREIGN KEY ("releaseId") REFERENCES "release" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_bded2e3ba0d5e4c76ed8cd9f7bb" FOREIGN KEY ("scopeId") REFERENCES "scope" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_content_history"("id", "createdAt", "updatedAt", "scopeId", "releaseId", "path", "selector", "content", "action", "inactive", "sourceContentHistoryId") SELECT "id", "createdAt", "updatedAt", "scopeId", "releaseId", "path", "selector", "content", "action", "inactive", "sourceContentHistoryId" FROM "content_history"`);
        await queryRunner.query(`DROP TABLE "content_history"`);
        await queryRunner.query(`ALTER TABLE "temporary_content_history" RENAME TO "content_history"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "content_history" RENAME TO "temporary_content_history"`);
        await queryRunner.query(`CREATE TABLE "content_history" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "scopeId" integer NOT NULL, "releaseId" integer NOT NULL, "path" varchar NOT NULL, "selector" text, "content" text, "action" varchar, "inactive" boolean NOT NULL DEFAULT (0), "sourceContentHistoryId" integer NOT NULL, CONSTRAINT "FK_a431a2b1b4b5b1fe9f15e77615b" FOREIGN KEY ("releaseId") REFERENCES "release" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_bded2e3ba0d5e4c76ed8cd9f7bb" FOREIGN KEY ("scopeId") REFERENCES "scope" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "content_history"("id", "createdAt", "updatedAt", "scopeId", "releaseId", "path", "selector", "content", "action", "inactive", "sourceContentHistoryId") SELECT "id", "createdAt", "updatedAt", "scopeId", "releaseId", "path", "selector", "content", "action", "inactive", "sourceContentHistoryId" FROM "temporary_content_history"`);
        await queryRunner.query(`DROP TABLE "temporary_content_history"`);
        await queryRunner.query(`ALTER TABLE "content_history" RENAME TO "temporary_content_history"`);
        await queryRunner.query(`CREATE TABLE "content_history" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "scopeId" integer NOT NULL, "releaseId" integer NOT NULL, "path" varchar NOT NULL, "selector" text, "content" text, "action" varchar, "inactive" boolean NOT NULL DEFAULT (0), "sourceContentHistoryId" integer NOT NULL, CONSTRAINT "FK_a431a2b1b4b5b1fe9f15e77615b" FOREIGN KEY ("releaseId") REFERENCES "release" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_bded2e3ba0d5e4c76ed8cd9f7bb" FOREIGN KEY ("scopeId") REFERENCES "scope" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "content_history"("id", "createdAt", "updatedAt", "scopeId", "releaseId", "path", "selector", "content", "action", "inactive", "sourceContentHistoryId") SELECT "id", "createdAt", "updatedAt", "scopeId", "releaseId", "path", "selector", "content", "action", "inactive", "sourceContentHistoryId" FROM "temporary_content_history"`);
        await queryRunner.query(`DROP TABLE "temporary_content_history"`);
    }

}
