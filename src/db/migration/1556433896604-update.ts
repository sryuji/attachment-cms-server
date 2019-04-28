import { MigrationInterface, QueryRunner } from 'typeorm'

export class update1556433896604 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "temporary_release" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "limitedReleaseToken" varchar(255) NOT NULL, "limitedReleaseTokenIssuedAt" datetime NOT NULL, "releasedAt" datetime NOT NULL, "rollbackedAt" datetime NOT NULL, "scopeId" integer)`,
    )
    await queryRunner.query(
      `INSERT INTO "temporary_release"("id", "createdAt", "updatedAt", "limitedReleaseToken", "limitedReleaseTokenIssuedAt", "releasedAt", "rollbackedAt", "scopeId") SELECT "id", "createdAt", "updatedAt", "limitedReleaseToken", "limitedReleaseTokenIssuedAt", "releasedAt", "rollbackedAt", "scopeId" FROM "release"`,
    )
    await queryRunner.query(`DROP TABLE "release"`)
    await queryRunner.query(`ALTER TABLE "temporary_release" RENAME TO "release"`)
    await queryRunner.query(
      `CREATE TABLE "temporary_release" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "limitedReleaseToken" varchar(255), "limitedReleaseTokenIssuedAt" datetime, "releasedAt" datetime, "rollbackedAt" datetime, "scopeId" integer NOT NULL)`,
    )
    await queryRunner.query(
      `INSERT INTO "temporary_release"("id", "createdAt", "updatedAt", "limitedReleaseToken", "limitedReleaseTokenIssuedAt", "releasedAt", "rollbackedAt", "scopeId") SELECT "id", "createdAt", "updatedAt", "limitedReleaseToken", "limitedReleaseTokenIssuedAt", "releasedAt", "rollbackedAt", "scopeId" FROM "release"`,
    )
    await queryRunner.query(`DROP TABLE "release"`)
    await queryRunner.query(`ALTER TABLE "temporary_release" RENAME TO "release"`)
    await queryRunner.query(
      `CREATE TABLE "temporary_content_history" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "path" varchar NOT NULL, "selector" text NOT NULL, "content" text NOT NULL, "action" varchar NOT NULL, "inactive" boolean NOT NULL DEFAULT (0), "scopeId" integer, "releaseId" integer, "sourceContentHistoryId" integer)`,
    )
    await queryRunner.query(
      `INSERT INTO "temporary_content_history"("id", "createdAt", "updatedAt", "path", "selector", "content", "action", "inactive", "scopeId", "releaseId", "sourceContentHistoryId") SELECT "id", "createdAt", "updatedAt", "path", "selector", "content", "action", "inactive", "scopeId", "releaseId", "sourceContentHistoryId" FROM "content_history"`,
    )
    await queryRunner.query(`DROP TABLE "content_history"`)
    await queryRunner.query(`ALTER TABLE "temporary_content_history" RENAME TO "content_history"`)
    await queryRunner.query(
      `CREATE TABLE "temporary_content_history" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "path" varchar NOT NULL, "selector" text, "content" text, "action" varchar, "inactive" boolean NOT NULL DEFAULT (0), "scopeId" integer NOT NULL, "releaseId" integer NOT NULL, "sourceContentHistoryId" integer)`,
    )
    await queryRunner.query(
      `INSERT INTO "temporary_content_history"("id", "createdAt", "updatedAt", "path", "selector", "content", "action", "inactive", "scopeId", "releaseId", "sourceContentHistoryId") SELECT "id", "createdAt", "updatedAt", "path", "selector", "content", "action", "inactive", "scopeId", "releaseId", "sourceContentHistoryId" FROM "content_history"`,
    )
    await queryRunner.query(`DROP TABLE "content_history"`)
    await queryRunner.query(`ALTER TABLE "temporary_content_history" RENAME TO "content_history"`)
    await queryRunner.query(
      `CREATE TABLE "temporary_release" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "limitedReleaseToken" varchar(255), "limitedReleaseTokenIssuedAt" datetime, "releasedAt" datetime, "rollbackedAt" datetime, "scopeId" integer NOT NULL, CONSTRAINT "FK_fa7c49ba5fb106c6cd9f7519cca" FOREIGN KEY ("scopeId") REFERENCES "scope" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    )
    await queryRunner.query(
      `INSERT INTO "temporary_release"("id", "createdAt", "updatedAt", "limitedReleaseToken", "limitedReleaseTokenIssuedAt", "releasedAt", "rollbackedAt", "scopeId") SELECT "id", "createdAt", "updatedAt", "limitedReleaseToken", "limitedReleaseTokenIssuedAt", "releasedAt", "rollbackedAt", "scopeId" FROM "release"`,
    )
    await queryRunner.query(`DROP TABLE "release"`)
    await queryRunner.query(`ALTER TABLE "temporary_release" RENAME TO "release"`)
    await queryRunner.query(
      `CREATE TABLE "temporary_content_history" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "path" varchar NOT NULL, "selector" text, "content" text, "action" varchar, "inactive" boolean NOT NULL DEFAULT (0), "scopeId" integer NOT NULL, "releaseId" integer NOT NULL, "sourceContentHistoryId" integer, CONSTRAINT "FK_bded2e3ba0d5e4c76ed8cd9f7bb" FOREIGN KEY ("scopeId") REFERENCES "scope" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_a431a2b1b4b5b1fe9f15e77615b" FOREIGN KEY ("releaseId") REFERENCES "release" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_e7201e07b3414aa676857c0ebff" FOREIGN KEY ("sourceContentHistoryId") REFERENCES "content_history" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    )
    await queryRunner.query(
      `INSERT INTO "temporary_content_history"("id", "createdAt", "updatedAt", "path", "selector", "content", "action", "inactive", "scopeId", "releaseId", "sourceContentHistoryId") SELECT "id", "createdAt", "updatedAt", "path", "selector", "content", "action", "inactive", "scopeId", "releaseId", "sourceContentHistoryId" FROM "content_history"`,
    )
    await queryRunner.query(`DROP TABLE "content_history"`)
    await queryRunner.query(`ALTER TABLE "temporary_content_history" RENAME TO "content_history"`)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "content_history" RENAME TO "temporary_content_history"`)
    await queryRunner.query(
      `CREATE TABLE "content_history" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "path" varchar NOT NULL, "selector" text, "content" text, "action" varchar, "inactive" boolean NOT NULL DEFAULT (0), "scopeId" integer NOT NULL, "releaseId" integer NOT NULL, "sourceContentHistoryId" integer)`,
    )
    await queryRunner.query(
      `INSERT INTO "content_history"("id", "createdAt", "updatedAt", "path", "selector", "content", "action", "inactive", "scopeId", "releaseId", "sourceContentHistoryId") SELECT "id", "createdAt", "updatedAt", "path", "selector", "content", "action", "inactive", "scopeId", "releaseId", "sourceContentHistoryId" FROM "temporary_content_history"`,
    )
    await queryRunner.query(`DROP TABLE "temporary_content_history"`)
    await queryRunner.query(`ALTER TABLE "release" RENAME TO "temporary_release"`)
    await queryRunner.query(
      `CREATE TABLE "release" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "limitedReleaseToken" varchar(255), "limitedReleaseTokenIssuedAt" datetime, "releasedAt" datetime, "rollbackedAt" datetime, "scopeId" integer NOT NULL)`,
    )
    await queryRunner.query(
      `INSERT INTO "release"("id", "createdAt", "updatedAt", "limitedReleaseToken", "limitedReleaseTokenIssuedAt", "releasedAt", "rollbackedAt", "scopeId") SELECT "id", "createdAt", "updatedAt", "limitedReleaseToken", "limitedReleaseTokenIssuedAt", "releasedAt", "rollbackedAt", "scopeId" FROM "temporary_release"`,
    )
    await queryRunner.query(`DROP TABLE "temporary_release"`)
    await queryRunner.query(`ALTER TABLE "content_history" RENAME TO "temporary_content_history"`)
    await queryRunner.query(
      `CREATE TABLE "content_history" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "path" varchar NOT NULL, "selector" text NOT NULL, "content" text NOT NULL, "action" varchar NOT NULL, "inactive" boolean NOT NULL DEFAULT (0), "scopeId" integer, "releaseId" integer, "sourceContentHistoryId" integer)`,
    )
    await queryRunner.query(
      `INSERT INTO "content_history"("id", "createdAt", "updatedAt", "path", "selector", "content", "action", "inactive", "scopeId", "releaseId", "sourceContentHistoryId") SELECT "id", "createdAt", "updatedAt", "path", "selector", "content", "action", "inactive", "scopeId", "releaseId", "sourceContentHistoryId" FROM "temporary_content_history"`,
    )
    await queryRunner.query(`DROP TABLE "temporary_content_history"`)
    await queryRunner.query(`ALTER TABLE "content_history" RENAME TO "temporary_content_history"`)
    await queryRunner.query(
      `CREATE TABLE "content_history" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "path" varchar NOT NULL, "selector" text NOT NULL, "content" text NOT NULL, "action" varchar NOT NULL, "inactive" boolean NOT NULL DEFAULT (0), "scopeId" integer, "releaseId" integer, "sourceContentHistoryId" integer, CONSTRAINT "FK_bded2e3ba0d5e4c76ed8cd9f7bb" FOREIGN KEY ("scopeId") REFERENCES "scope" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    )
    await queryRunner.query(
      `INSERT INTO "content_history"("id", "createdAt", "updatedAt", "path", "selector", "content", "action", "inactive", "scopeId", "releaseId", "sourceContentHistoryId") SELECT "id", "createdAt", "updatedAt", "path", "selector", "content", "action", "inactive", "scopeId", "releaseId", "sourceContentHistoryId" FROM "temporary_content_history"`,
    )
    await queryRunner.query(`DROP TABLE "temporary_content_history"`)
    await queryRunner.query(`ALTER TABLE "release" RENAME TO "temporary_release"`)
    await queryRunner.query(
      `CREATE TABLE "release" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "limitedReleaseToken" varchar(255) NOT NULL, "limitedReleaseTokenIssuedAt" datetime NOT NULL, "releasedAt" datetime NOT NULL, "rollbackedAt" datetime NOT NULL, "scopeId" integer)`,
    )
    await queryRunner.query(
      `INSERT INTO "release"("id", "createdAt", "updatedAt", "limitedReleaseToken", "limitedReleaseTokenIssuedAt", "releasedAt", "rollbackedAt", "scopeId") SELECT "id", "createdAt", "updatedAt", "limitedReleaseToken", "limitedReleaseTokenIssuedAt", "releasedAt", "rollbackedAt", "scopeId" FROM "temporary_release"`,
    )
    await queryRunner.query(`DROP TABLE "temporary_release"`)
    await queryRunner.query(`ALTER TABLE "release" RENAME TO "temporary_release"`)
    await queryRunner.query(
      `CREATE TABLE "release" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "limitedReleaseToken" varchar(255) NOT NULL, "limitedReleaseTokenIssuedAt" datetime NOT NULL, "releasedAt" datetime NOT NULL, "rollbackedAt" datetime NOT NULL, "scopeId" integer, CONSTRAINT "FK_fa7c49ba5fb106c6cd9f7519cca" FOREIGN KEY ("scopeId") REFERENCES "scope" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    )
    await queryRunner.query(
      `INSERT INTO "release"("id", "createdAt", "updatedAt", "limitedReleaseToken", "limitedReleaseTokenIssuedAt", "releasedAt", "rollbackedAt", "scopeId") SELECT "id", "createdAt", "updatedAt", "limitedReleaseToken", "limitedReleaseTokenIssuedAt", "releasedAt", "rollbackedAt", "scopeId" FROM "temporary_release"`,
    )
    await queryRunner.query(`DROP TABLE "temporary_release"`)
  }
}
