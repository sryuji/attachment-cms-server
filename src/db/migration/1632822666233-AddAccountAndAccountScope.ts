import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAccountAndAccountScope1632822666233 implements MigrationInterface {
    name = 'AddAccountAndAccountScope1632822666233'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_account" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "email" varchar NOT NULL, "lastName" varchar(64), "firstName" varchar(64), "avatarUrl" varchar, "googleAccessToken" varchar, "googleRefreshToken" varchar, CONSTRAINT "UQ_4c8f96ccf523e9a3faefd5bdd4c" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_account"("id", "createdAt", "updatedAt", "email", "lastName", "firstName", "avatarUrl", "googleAccessToken", "googleRefreshToken") SELECT "id", "createdAt", "updatedAt", "email", "lastName", "firstName", "avatarUrl", "googleAccessToken", "googleRefreshToken" FROM "account"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`ALTER TABLE "temporary_account" RENAME TO "account"`);
        await queryRunner.query(`CREATE TABLE "temporary_account" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "email" varchar NOT NULL, "lastName" varchar(64), "firstName" varchar(64), "avatarUrl" varchar, "googleAccessToken" varchar, "googleRefreshToken" varchar, "jwtRefreshToken" varchar, "jwtRefreshTokenIssuedAt" datetime, "authenticatedAt" datetime, CONSTRAINT "UQ_4c8f96ccf523e9a3faefd5bdd4c" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_account"("id", "createdAt", "updatedAt", "email", "lastName", "firstName", "avatarUrl", "googleAccessToken", "googleRefreshToken") SELECT "id", "createdAt", "updatedAt", "email", "lastName", "firstName", "avatarUrl", "googleAccessToken", "googleRefreshToken" FROM "account"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`ALTER TABLE "temporary_account" RENAME TO "account"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" RENAME TO "temporary_account"`);
        await queryRunner.query(`CREATE TABLE "account" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "email" varchar NOT NULL, "lastName" varchar(64), "firstName" varchar(64), "avatarUrl" varchar, "googleAccessToken" varchar, "googleRefreshToken" varchar, CONSTRAINT "UQ_4c8f96ccf523e9a3faefd5bdd4c" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "account"("id", "createdAt", "updatedAt", "email", "lastName", "firstName", "avatarUrl", "googleAccessToken", "googleRefreshToken") SELECT "id", "createdAt", "updatedAt", "email", "lastName", "firstName", "avatarUrl", "googleAccessToken", "googleRefreshToken" FROM "temporary_account"`);
        await queryRunner.query(`DROP TABLE "temporary_account"`);
        await queryRunner.query(`ALTER TABLE "account" RENAME TO "temporary_account"`);
        await queryRunner.query(`CREATE TABLE "account" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "email" varchar NOT NULL, "lastName" varchar(64), "firstName" varchar(64), "avatarUrl" varchar, "googleAccessToken" varchar, "googleRefreshToken" varchar, "googleAuthenticatedAt" datetime, CONSTRAINT "UQ_4c8f96ccf523e9a3faefd5bdd4c" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "account"("id", "createdAt", "updatedAt", "email", "lastName", "firstName", "avatarUrl", "googleAccessToken", "googleRefreshToken") SELECT "id", "createdAt", "updatedAt", "email", "lastName", "firstName", "avatarUrl", "googleAccessToken", "googleRefreshToken" FROM "temporary_account"`);
        await queryRunner.query(`DROP TABLE "temporary_account"`);
    }

}
