import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialPostgresSchema1780000000000 implements MigrationInterface {
    name = "InitialPostgresSchema1780000000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`CREATE TYPE "reservation_status_enum" AS ENUM ('PENDING', 'EXPIRED', 'COMPLETED')`);
        await queryRunner.query(`CREATE TYPE "ticket_status_enum" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD')`);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                CONSTRAINT "UQ_user_email" UNIQUE ("email"),
                CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "concert" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(255) NOT NULL,
                "date" TIMESTAMP WITH TIME ZONE NOT NULL,
                "venue" character varying(255) NOT NULL,
                "stock" integer NOT NULL DEFAULT 0,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_concert_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ticket" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "concertId" uuid NOT NULL,
                "seatNumber" character varying NOT NULL,
                "price" numeric(10,2) NOT NULL,
                "status" "ticket_status_enum" NOT NULL DEFAULT 'AVAILABLE',
                "internal_note" text,
                "version" integer NOT NULL DEFAULT 1,
                CONSTRAINT "PK_ticket_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_ticket_concert" FOREIGN KEY ("concertId") REFERENCES "concert"("id") ON DELETE CASCADE
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_ticket_concert_id" ON "ticket" ("concertId")`);
        await queryRunner.query(`
            CREATE TABLE "reservation" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "concertId" uuid NOT NULL,
                "userId" uuid NOT NULL,
                "ticketId" uuid NOT NULL,
                "status" "reservation_status_enum" NOT NULL DEFAULT 'PENDING',
                "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_reservation_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_reservation_concert" FOREIGN KEY ("concertId") REFERENCES "concert"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_reservation_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_reservation_ticket" FOREIGN KEY ("ticketId") REFERENCES "ticket"("id") ON DELETE CASCADE
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_reservation_pending_expires" ON "reservation" ("expiresAt") WHERE "status" = 'PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_reservation_pending_expires"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "reservation"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_ticket_concert_id"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "ticket"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "concert"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "ticket_status_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "reservation_status_enum"`);
    }
}
