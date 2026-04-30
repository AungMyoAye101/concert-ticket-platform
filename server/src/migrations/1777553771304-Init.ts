import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1777553771304 implements MigrationInterface {
    name = 'Init1777553771304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ticket" ("id" varchar PRIMARY KEY NOT NULL, "concertId" varchar NOT NULL, "seatNumber" varchar NOT NULL, "price" decimal NOT NULL, "status" varchar NOT NULL, "category" varchar CHECK( "category" IN ('VIP','GENERAL') ) NOT NULL DEFAULT ('GENERAL'))`);
        await queryRunner.query(`CREATE TABLE "temporary_concert" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "date" datetime NOT NULL, "venue" varchar NOT NULL, "stock" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "temporary_concert"("id", "title", "date", "venue", "stock") SELECT "id", "title", "date", "venue", "stock" FROM "concert"`);
        await queryRunner.query(`DROP TABLE "concert"`);
        await queryRunner.query(`ALTER TABLE "temporary_concert" RENAME TO "concert"`);
        await queryRunner.query(`CREATE TABLE "temporary_reservation" ("id" varchar PRIMARY KEY NOT NULL, "concertId" varchar NOT NULL, "userId" varchar NOT NULL, "status" varchar NOT NULL, "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "ticketId" varchar)`);
        await queryRunner.query(`INSERT INTO "temporary_reservation"("id", "concertId", "userId", "status", "expiresAt") SELECT "id", "concertId", "userId", "status", "expiresAt" FROM "reservation"`);
        await queryRunner.query(`DROP TABLE "reservation"`);
        await queryRunner.query(`ALTER TABLE "temporary_reservation" RENAME TO "reservation"`);
        await queryRunner.query(`CREATE TABLE "temporary_concert" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar(255) NOT NULL, "date" datetime NOT NULL, "venue" varchar(255) NOT NULL, "stock" integer NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "temporary_concert"("id", "title", "date", "venue", "stock", "createdAt", "updatedAt") SELECT "id", "title", "date", "venue", "stock", "createdAt", "updatedAt" FROM "concert"`);
        await queryRunner.query(`DROP TABLE "concert"`);
        await queryRunner.query(`ALTER TABLE "temporary_concert" RENAME TO "concert"`);
        await queryRunner.query(`CREATE TABLE "temporary_reservation" ("id" varchar PRIMARY KEY NOT NULL, "concertId" varchar NOT NULL, "userId" varchar NOT NULL, "status" varchar CHECK( "status" IN ('PENDING','COMPLETED','EXPIRED','COMPLETED') ) NOT NULL DEFAULT ('PENDING'), "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "ticketId" varchar)`);
        await queryRunner.query(`INSERT INTO "temporary_reservation"("id", "concertId", "userId", "status", "expiresAt", "createdAt", "updatedAt", "ticketId") SELECT "id", "concertId", "userId", "status", "expiresAt", "createdAt", "updatedAt", "ticketId" FROM "reservation"`);
        await queryRunner.query(`DROP TABLE "reservation"`);
        await queryRunner.query(`ALTER TABLE "temporary_reservation" RENAME TO "reservation"`);
        await queryRunner.query(`CREATE INDEX "idx_reservation_status" ON "reservation" ("status") WHERE status = PENDING`);
        await queryRunner.query(`CREATE TABLE "temporary_ticket" ("id" varchar PRIMARY KEY NOT NULL, "concertId" varchar NOT NULL, "seatNumber" varchar NOT NULL, "price" decimal NOT NULL, "status" varchar NOT NULL, "category" varchar CHECK( "category" IN ('VIP','GENERAL') ) NOT NULL DEFAULT ('GENERAL'), CONSTRAINT "FK_ef8e1c3effd13564a3e3dd569ac" FOREIGN KEY ("concertId") REFERENCES "concert" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_ticket"("id", "concertId", "seatNumber", "price", "status", "category") SELECT "id", "concertId", "seatNumber", "price", "status", "category" FROM "ticket"`);
        await queryRunner.query(`DROP TABLE "ticket"`);
        await queryRunner.query(`ALTER TABLE "temporary_ticket" RENAME TO "ticket"`);
        await queryRunner.query(`DROP INDEX "idx_reservation_status"`);
        await queryRunner.query(`CREATE TABLE "temporary_reservation" ("id" varchar PRIMARY KEY NOT NULL, "concertId" varchar NOT NULL, "userId" varchar NOT NULL, "status" varchar CHECK( "status" IN ('PENDING','COMPLETED','EXPIRED','COMPLETED') ) NOT NULL DEFAULT ('PENDING'), "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "ticketId" varchar, CONSTRAINT "FK_89bfdbd68955fe6afc100e23403" FOREIGN KEY ("ticketId") REFERENCES "ticket" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_reservation"("id", "concertId", "userId", "status", "expiresAt", "createdAt", "updatedAt", "ticketId") SELECT "id", "concertId", "userId", "status", "expiresAt", "createdAt", "updatedAt", "ticketId" FROM "reservation"`);
        await queryRunner.query(`DROP TABLE "reservation"`);
        await queryRunner.query(`ALTER TABLE "temporary_reservation" RENAME TO "reservation"`);
        await queryRunner.query(`CREATE INDEX "idx_reservation_status" ON "reservation" ("status") WHERE status = PENDING`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "idx_reservation_status"`);
        await queryRunner.query(`ALTER TABLE "reservation" RENAME TO "temporary_reservation"`);
        await queryRunner.query(`CREATE TABLE "reservation" ("id" varchar PRIMARY KEY NOT NULL, "concertId" varchar NOT NULL, "userId" varchar NOT NULL, "status" varchar CHECK( "status" IN ('PENDING','COMPLETED','EXPIRED','COMPLETED') ) NOT NULL DEFAULT ('PENDING'), "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "ticketId" varchar)`);
        await queryRunner.query(`INSERT INTO "reservation"("id", "concertId", "userId", "status", "expiresAt", "createdAt", "updatedAt", "ticketId") SELECT "id", "concertId", "userId", "status", "expiresAt", "createdAt", "updatedAt", "ticketId" FROM "temporary_reservation"`);
        await queryRunner.query(`DROP TABLE "temporary_reservation"`);
        await queryRunner.query(`CREATE INDEX "idx_reservation_status" ON "reservation" ("status") WHERE status = PENDING`);
        await queryRunner.query(`ALTER TABLE "ticket" RENAME TO "temporary_ticket"`);
        await queryRunner.query(`CREATE TABLE "ticket" ("id" varchar PRIMARY KEY NOT NULL, "concertId" varchar NOT NULL, "seatNumber" varchar NOT NULL, "price" decimal NOT NULL, "status" varchar NOT NULL, "category" varchar CHECK( "category" IN ('VIP','GENERAL') ) NOT NULL DEFAULT ('GENERAL'))`);
        await queryRunner.query(`INSERT INTO "ticket"("id", "concertId", "seatNumber", "price", "status", "category") SELECT "id", "concertId", "seatNumber", "price", "status", "category" FROM "temporary_ticket"`);
        await queryRunner.query(`DROP TABLE "temporary_ticket"`);
        await queryRunner.query(`DROP INDEX "idx_reservation_status"`);
        await queryRunner.query(`ALTER TABLE "reservation" RENAME TO "temporary_reservation"`);
        await queryRunner.query(`CREATE TABLE "reservation" ("id" varchar PRIMARY KEY NOT NULL, "concertId" varchar NOT NULL, "userId" varchar NOT NULL, "status" varchar NOT NULL, "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "ticketId" varchar)`);
        await queryRunner.query(`INSERT INTO "reservation"("id", "concertId", "userId", "status", "expiresAt", "createdAt", "updatedAt", "ticketId") SELECT "id", "concertId", "userId", "status", "expiresAt", "createdAt", "updatedAt", "ticketId" FROM "temporary_reservation"`);
        await queryRunner.query(`DROP TABLE "temporary_reservation"`);
        await queryRunner.query(`ALTER TABLE "concert" RENAME TO "temporary_concert"`);
        await queryRunner.query(`CREATE TABLE "concert" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "date" datetime NOT NULL, "venue" varchar NOT NULL, "stock" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "concert"("id", "title", "date", "venue", "stock", "createdAt", "updatedAt") SELECT "id", "title", "date", "venue", "stock", "createdAt", "updatedAt" FROM "temporary_concert"`);
        await queryRunner.query(`DROP TABLE "temporary_concert"`);
        await queryRunner.query(`ALTER TABLE "reservation" RENAME TO "temporary_reservation"`);
        await queryRunner.query(`CREATE TABLE "reservation" ("id" varchar PRIMARY KEY NOT NULL, "concertId" varchar NOT NULL, "userId" varchar NOT NULL, "status" varchar NOT NULL, "expiresAt" datetime NOT NULL)`);
        await queryRunner.query(`INSERT INTO "reservation"("id", "concertId", "userId", "status", "expiresAt") SELECT "id", "concertId", "userId", "status", "expiresAt" FROM "temporary_reservation"`);
        await queryRunner.query(`DROP TABLE "temporary_reservation"`);
        await queryRunner.query(`ALTER TABLE "concert" RENAME TO "temporary_concert"`);
        await queryRunner.query(`CREATE TABLE "concert" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "date" datetime NOT NULL, "venue" varchar NOT NULL, "stock" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "concert"("id", "title", "date", "venue", "stock") SELECT "id", "title", "date", "venue", "stock" FROM "temporary_concert"`);
        await queryRunner.query(`DROP TABLE "temporary_concert"`);
        await queryRunner.query(`DROP TABLE "ticket"`);
    }

}
