import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778418894435 implements MigrationInterface {
    name = 'Init1778418894435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."ticket_status_enum" AS ENUM('AVAILABLE', 'RESERVED', 'SOLD')`);
        await queryRunner.query(`CREATE TYPE "public"."ticket_category_enum" AS ENUM('VIP', 'GENERAL')`);
        await queryRunner.query(`CREATE TABLE "ticket" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "concertId" uuid NOT NULL, "seatNumber" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "status" "public"."ticket_status_enum" NOT NULL DEFAULT 'AVAILABLE', "category" "public"."ticket_category_enum" NOT NULL DEFAULT 'GENERAL', "internal_note" text, "version" integer NOT NULL, CONSTRAINT "PK_d9a0835407701eb86f874474b7c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_ticket_concert_id" ON "ticket" ("concertId") `);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."reservation_status_enum" AS ENUM('PENDING', 'EXPIRED', 'COMPLETED')`);
        await queryRunner.query(`CREATE TABLE "reservation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "concertId" uuid NOT NULL, "userId" uuid NOT NULL, "ticketId" uuid NOT NULL, "status" "public"."reservation_status_enum" NOT NULL DEFAULT 'PENDING', "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_48b1f9922368359ab88e8bfa525" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_reservation_pending_expires" ON "reservation" ("expiresAt") WHERE "status" = 'PENDING'`);
        await queryRunner.query(`CREATE TABLE "concert" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL, "venue" character varying(255) NOT NULL, "stock" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c96bfb33ee9a95525a3f5269d1f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_ef8e1c3effd13564a3e3dd569ac" FOREIGN KEY ("concertId") REFERENCES "concert"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_695fee0a1da3b71b59f0c1e00b9" FOREIGN KEY ("concertId") REFERENCES "concert"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_529dceb01ef681127fef04d755d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_89bfdbd68955fe6afc100e23403" FOREIGN KEY ("ticketId") REFERENCES "ticket"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_89bfdbd68955fe6afc100e23403"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_529dceb01ef681127fef04d755d"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_695fee0a1da3b71b59f0c1e00b9"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_ef8e1c3effd13564a3e3dd569ac"`);
        await queryRunner.query(`DROP TABLE "concert"`);
        await queryRunner.query(`DROP INDEX "public"."idx_reservation_pending_expires"`);
        await queryRunner.query(`DROP TABLE "reservation"`);
        await queryRunner.query(`DROP TYPE "public"."reservation_status_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."idx_ticket_concert_id"`);
        await queryRunner.query(`DROP TABLE "ticket"`);
        await queryRunner.query(`DROP TYPE "public"."ticket_category_enum"`);
        await queryRunner.query(`DROP TYPE "public"."ticket_status_enum"`);
    }

}
