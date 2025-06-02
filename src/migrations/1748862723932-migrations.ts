import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1748862723932 implements MigrationInterface {
    name = 'Migrations1748862723932'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_info" RENAME COLUMN "Instagram" TO "instagram"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_info" RENAME COLUMN "instagram" TO "Instagram"`);
    }

}
