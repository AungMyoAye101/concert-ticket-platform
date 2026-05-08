import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTicketCategory1780000001000 implements MigrationInterface {
    name = "AddTicketCategory1780000001000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "ticket_category_enum" AS ENUM ('VIP', 'GENERAL')`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "category" "ticket_category_enum" NOT NULL DEFAULT 'GENERAL'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "category"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "ticket_category_enum"`);
    }
}
