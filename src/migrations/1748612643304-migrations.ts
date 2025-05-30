import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1748612643304 implements MigrationInterface {
    name = 'Migrations1748612643304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team_member" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "team_member" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "team_member" ADD "fullName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "FK_8450e399692e33a47410136d500"`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "brandId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "FK_8450e399692e33a47410136d500" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "FK_8450e399692e33a47410136d500"`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "brandId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "FK_8450e399692e33a47410136d500" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_member" DROP COLUMN "fullName"`);
        await queryRunner.query(`ALTER TABLE "team_member" ADD "lastName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "team_member" ADD "firstName" character varying NOT NULL`);
    }

}
