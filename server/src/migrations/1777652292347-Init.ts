import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1777652292347 implements MigrationInterface {
    name = 'Init1777652292347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_ticket" ("id" varchar PRIMARY KEY NOT NULL, "concertId" varchar NOT NULL, "seatNumber" varchar NOT NULL, "price" decimal NOT NULL, "status" varchar NOT NULL, "category" varchar CHECK( "category" IN ('VIP','GENERAL') ) NOT NULL DEFAULT ('GENERAL'), CONSTRAINT "FK_ef8e1c3effd13564a3e3dd569ac" FOREIGN KEY ("concertId") REFERENCES "concert" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_ticket"("id", "concertId", "seatNumber", "price", "status", "category") SELECT "id", "concertId", "seatNumber", "price", "status", "category" FROM "ticket"`);
        await queryRunner.query(`DROP TABLE "ticket"`);
        await queryRunner.query(`ALTER TABLE "temporary_ticket" RENAME TO "ticket"`);
        await queryRunner.query(`CREATE TABLE "temporary_reservation" ("id" varchar PRIMARY KEY NOT NULL, "concertId" varchar NOT NULL, "userId" varchar NOT NULL, "status" varchar CHECK( "status" IN ('PENDING','COMPLETED','EXPIRED','COMPLETED') ) NOT NULL DEFAULT ('PENDING'), "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "ticketId" varchar, CONSTRAINT "FK_89bfdbd68955fe6afc100e23403" FOREIGN KEY ("ticketId") REFERENCES "ticket" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_reservation"("id", "concertId", "userId", "status", "expiresAt", "createdAt", "updatedAt", "ticketId") SELECT "id", "concertId", "userId", "status", "expiresAt", "createdAt", "updatedAt", "ticketId" FROM "reservation"`);
        await queryRunner.query(`DROP TABLE "reservation"`);
        await queryRunner.query(`ALTER TABLE "temporary_reservation" RENAME TO "reservation"`);
        await queryRunner.query(`CREATE TABLE "temporary_ticket" ("id" varchar PRIMARY KEY NOT NULL, "concertId" varchar NOT NULL, "seatNumber" varchar NOT NULL, "price" decimal NOT NULL, "status" varchar NOT NULL, "category" varchar CHECK( "category" IN ('VIP','GENERAL') ) NOT NULL DEFAULT ('GENERAL'), CONSTRAINT "FK_ef8e1c3effd13564a3e3dd569ac" FOREIGN KEY ("concertId") REFERENCES "concert" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_ticket"("id", "concertId", "seatNumber", "price", "status", "category") SELECT "id", "concertId", "seatNumber", "price", "status", "category" FROM "ticket"`);
        await queryRunner.query(`DROP TABLE "ticket"`);
        await queryRunner.query(`ALTER TABLE "temporary_ticket" RENAME TO "ticket"`);
        await queryRunner.query(`CREATE TABLE "temporary_reservation" ("id" varchar PRIMARY KEY NOT NULL, "concertId" varchar NOT NULL, "userId" varchar NOT NULL, "status" varchar CHECK( "status" IN ('PENDING','COMPLETED','EXPIRED','COMPLETED') ) NOT NULL DEFAULT ('PENDING'), "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "ticketId" varchar, CONSTRAINT "FK_89bfdbd68955fe6afc100e23403" FOREIGN KEY ("ticketId") REFERENCES "ticket" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_reservation"("id", "concertId", "userId", "status", "expiresAt", "createdAt", "updatedAt", "ticketId") SELECT "id", "concertId", "userId", "status", "expiresAt", "createdAt", "updatedAt", "ticketId" FROM "reservation"`);
        await queryRunner.query(`DROP TABLE "reservation"`);
        await queryRunner.query(`ALTER TABLE "temporary_reservation" RENAME TO "reservation"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" RENAME TO "temporary_reservation"`);
        await queryRunner.query(`CREATE TABLE "reservation" ("id" varchar PRIMARY KEY NOT NULL, "concertId" varchar NOT NULL, "userId" varchar NOT NULL, "status" varchar CHECK( "status" IN ('PENDING','COMPLETED','EXPIRED','COMPLETED') ) NOT NULL DEFAULT ('PENDING'), "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "ticketId" varchar, CONSTRAINT "FK_89bfdbd68955fe6afc100e23403" FOREIGN KEY ("ticketId") REFERENCES "ticket" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "reservation"("id", "concertId", "userId", "status", "expiresAt", "createdAt", "updatedAt", "ticketId") SELECT "id", "concertId", "userId", "status", "expiresAt", "createdAt", "updatedAt", "ticketId" FROM "temporary_reservation"`);
        await queryRunner.query(`DROP TABLE "temporary_reservation"`);
        await queryRunner.query(`ALTER TABLE "ticket" RENAME TO "temporary_ticket"`);
        await queryRunner.query(`CREATE TABLE "ticket" ("id" varchar PRIMARY KEY NOT NULL, "concertId" varchar NOT NULL, "seatNumber" varchar NOT NULL, "price" decimal NOT NULL, "status" varchar NOT NULL, "category" varchar CHECK( "category" IN ('VIP','GENERAL') ) NOT NULL DEFAULT ('GENERAL'), CONSTRAINT "FK_ef8e1c3effd13564a3e3dd569ac" FOREIGN KEY ("concertId") REFERENCES "concert" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "ticket"("id", "concertId", "seatNumber", "price", "status", "category") SELECT "id", "concertId", "seatNumber", "price", "status", "category" FROM "temporary_ticket"`);
        await queryRunner.query(`DROP TABLE "temporary_ticket"`);
        await queryRunner.query(`ALTER TABLE "reservation" RENAME TO "temporary_reservation"`);
        await queryRunner.query(`CREATE TABLE "reservation" ("id" varchar PRIMARY KEY NOT NULL, "concertId" varchar NOT NULL, "userId" varchar NOT NULL, "status" varchar CHECK( "status" IN ('PENDING','COMPLETED','EXPIRED','COMPLETED') ) NOT NULL DEFAULT ('PENDING'), "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "ticketId" varchar, CONSTRAINT "FK_89bfdbd68955fe6afc100e23403" FOREIGN KEY ("ticketId") REFERENCES "ticket" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "reservation"("id", "concertId", "userId", "status", "expiresAt", "createdAt", "updatedAt", "ticketId") SELECT "id", "concertId", "userId", "status", "expiresAt", "createdAt", "updatedAt", "ticketId" FROM "temporary_reservation"`);
        await queryRunner.query(`DROP TABLE "temporary_reservation"`);
        await queryRunner.query(`ALTER TABLE "ticket" RENAME TO "temporary_ticket"`);
        await queryRunner.query(`CREATE TABLE "ticket" ("id" varchar PRIMARY KEY NOT NULL, "concertId" varchar NOT NULL, "seatNumber" varchar NOT NULL, "price" decimal NOT NULL, "status" varchar NOT NULL, "category" varchar CHECK( "category" IN ('VIP','GENERAL') ) NOT NULL DEFAULT ('GENERAL'), CONSTRAINT "FK_ef8e1c3effd13564a3e3dd569ac" FOREIGN KEY ("concertId") REFERENCES "concert" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "ticket"("id", "concertId", "seatNumber", "price", "status", "category") SELECT "id", "concertId", "seatNumber", "price", "status", "category" FROM "temporary_ticket"`);
        await queryRunner.query(`DROP TABLE "temporary_ticket"`);
    }

}
