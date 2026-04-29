import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1777481137532 implements MigrationInterface {
    name = 'Init1777481137532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "concert" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "date" datetime NOT NULL, "venue" varchar NOT NULL, "stock" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "reservation" ("id" varchar PRIMARY KEY NOT NULL, "concertId" varchar NOT NULL, "userId" varchar NOT NULL, "status" varchar NOT NULL, "expiresAt" datetime NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "reservation"`);
        await queryRunner.query(`DROP TABLE "concert"`);
    }

}
