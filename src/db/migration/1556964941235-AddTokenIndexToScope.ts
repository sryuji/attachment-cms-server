import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddTokenIndexToScope1556964941235 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "temporary_scope" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar(255), "domain" varchar(255) NOT NULL, "testDomain" varchar(255), "description" text, "token" varchar(255) NOT NULL, "defaultReleaseId" integer, CONSTRAINT "UQ_a86075db6f83ca160b07fb9f73a" UNIQUE ("defaultReleaseId"), CONSTRAINT "FK_a86075db6f83ca160b07fb9f73a" FOREIGN KEY ("defaultReleaseId") REFERENCES "release" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    )
    await queryRunner.query(
      `INSERT INTO "temporary_scope"("id", "createdAt", "updatedAt", "name", "domain", "testDomain", "description", "token", "defaultReleaseId") SELECT "id", "createdAt", "updatedAt", "name", "domain", "testDomain", "description", "token", "defaultReleaseId" FROM "scope"`,
    )
    await queryRunner.query(`DROP TABLE "scope"`)
    await queryRunner.query(`ALTER TABLE "temporary_scope" RENAME TO "scope"`)
    await queryRunner.query(
      `CREATE TABLE "temporary_scope" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar(255), "domain" varchar(255) NOT NULL, "testDomain" varchar(255), "description" text, "token" varchar(255) NOT NULL, "defaultReleaseId" integer, CONSTRAINT "UQ_a86075db6f83ca160b07fb9f73a" UNIQUE ("defaultReleaseId"), CONSTRAINT "UQ_0b5fd0ec42c2b4f6583b8171f7d" UNIQUE ("token"), CONSTRAINT "FK_a86075db6f83ca160b07fb9f73a" FOREIGN KEY ("defaultReleaseId") REFERENCES "release" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    )
    await queryRunner.query(
      `INSERT INTO "temporary_scope"("id", "createdAt", "updatedAt", "name", "domain", "testDomain", "description", "token", "defaultReleaseId") SELECT "id", "createdAt", "updatedAt", "name", "domain", "testDomain", "description", "token", "defaultReleaseId" FROM "scope"`,
    )
    await queryRunner.query(`DROP TABLE "scope"`)
    await queryRunner.query(`ALTER TABLE "temporary_scope" RENAME TO "scope"`)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "scope" RENAME TO "temporary_scope"`)
    await queryRunner.query(
      `CREATE TABLE "scope" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar(255), "domain" varchar(255) NOT NULL, "testDomain" varchar(255), "description" text, "token" varchar(255) NOT NULL, "defaultReleaseId" integer, CONSTRAINT "UQ_a86075db6f83ca160b07fb9f73a" UNIQUE ("defaultReleaseId"), CONSTRAINT "FK_a86075db6f83ca160b07fb9f73a" FOREIGN KEY ("defaultReleaseId") REFERENCES "release" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    )
    await queryRunner.query(
      `INSERT INTO "scope"("id", "createdAt", "updatedAt", "name", "domain", "testDomain", "description", "token", "defaultReleaseId") SELECT "id", "createdAt", "updatedAt", "name", "domain", "testDomain", "description", "token", "defaultReleaseId" FROM "temporary_scope"`,
    )
    await queryRunner.query(`DROP TABLE "temporary_scope"`)
    await queryRunner.query(`ALTER TABLE "scope" RENAME TO "temporary_scope"`)
    await queryRunner.query(
      `CREATE TABLE "scope" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar(255), "domain" varchar(255) NOT NULL, "testDomain" varchar(255), "description" text, "token" varchar(255) NOT NULL, "defaultReleaseId" integer, CONSTRAINT "UQ_a86075db6f83ca160b07fb9f73a" UNIQUE ("defaultReleaseId"), CONSTRAINT "FK_a86075db6f83ca160b07fb9f73a" FOREIGN KEY ("defaultReleaseId") REFERENCES "release" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    )
    await queryRunner.query(
      `INSERT INTO "scope"("id", "createdAt", "updatedAt", "name", "domain", "testDomain", "description", "token", "defaultReleaseId") SELECT "id", "createdAt", "updatedAt", "name", "domain", "testDomain", "description", "token", "defaultReleaseId" FROM "temporary_scope"`,
    )
    await queryRunner.query(`DROP TABLE "temporary_scope"`)
  }
}
