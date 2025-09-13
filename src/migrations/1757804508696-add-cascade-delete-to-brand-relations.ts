import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeDeleteToBrandRelations1757804508696 implements MigrationInterface {
    name = 'AddCascadeDeleteToBrandRelations1757804508696'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "brand" ADD CONSTRAINT "UQ_5f468ae5696f07da025138e38f7" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "brand" DROP CONSTRAINT "UQ_5f468ae5696f07da025138e38f7"`);
    }

}
