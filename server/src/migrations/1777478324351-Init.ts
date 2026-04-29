import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1777478324351 implements MigrationInterface {
    name = 'Init1777478324351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "concert" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "date" datetime NOT NULL, "venue" varchar NOT NULL, "stock" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "reservation" ("id" varchar PRIMARY KEY NOT NULL, "concertId" integer NOT NULL, "userId" integer NOT NULL, "status" varchar NOT NULL, "expiresAt" varchar NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "reservation"`);
        await queryRunner.query(`DROP TABLE "concert"`);
    }

}
