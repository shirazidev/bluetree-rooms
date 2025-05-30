import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1748605821028 implements MigrationInterface {
    name = 'Migrations1748605821028'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "fullName" character varying(100) NOT NULL, "username" character varying(100) NOT NULL, "password" character varying(100) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contact_info" ("id" SERIAL NOT NULL, "linkedin" character varying NOT NULL, "phone" character varying NOT NULL, "telegram" character varying NOT NULL, "Instagram" character varying NOT NULL, "brandId" integer, CONSTRAINT "PK_65b98fa4ffb26dceb9192f5d496" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "about_us" ("id" SERIAL NOT NULL, "content" text NOT NULL, CONSTRAINT "PK_f9643a00dea811eecf941ab4fdc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room" ("id" SERIAL NOT NULL, "slug" character varying NOT NULL, "brandId" integer NOT NULL, CONSTRAINT "UQ_e2da13c7d1bbecd716bbe9e688a" UNIQUE ("slug"), CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "brand" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "logoUrl" character varying, "roomId" integer, "aboutUsId" integer, CONSTRAINT "REL_53f8863a553fb4eeb9942b75ea" UNIQUE ("roomId"), CONSTRAINT "REL_c8f9d4f1df90499bf508a9cc8d" UNIQUE ("aboutUsId"), CONSTRAINT "PK_a5d20765ddd942eb5de4eee2d7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "team_member" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "role" character varying, "profileImageUrl" character varying, "brandId" integer, CONSTRAINT "PK_649680684d72a20d279641469c5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "images" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "location" character varying NOT NULL, "alt" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contact_info" ADD CONSTRAINT "FK_73c8fb67440ab50966a2b825fe7" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "FK_8450e399692e33a47410136d500" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "brand" ADD CONSTRAINT "FK_53f8863a553fb4eeb9942b75ea5" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "brand" ADD CONSTRAINT "FK_c8f9d4f1df90499bf508a9cc8d7" FOREIGN KEY ("aboutUsId") REFERENCES "about_us"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_member" ADD CONSTRAINT "FK_c46a3aa252cc118d0d3d044d38e" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team_member" DROP CONSTRAINT "FK_c46a3aa252cc118d0d3d044d38e"`);
        await queryRunner.query(`ALTER TABLE "brand" DROP CONSTRAINT "FK_c8f9d4f1df90499bf508a9cc8d7"`);
        await queryRunner.query(`ALTER TABLE "brand" DROP CONSTRAINT "FK_53f8863a553fb4eeb9942b75ea5"`);
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "FK_8450e399692e33a47410136d500"`);
        await queryRunner.query(`ALTER TABLE "contact_info" DROP CONSTRAINT "FK_73c8fb67440ab50966a2b825fe7"`);
        await queryRunner.query(`DROP TABLE "images"`);
        await queryRunner.query(`DROP TABLE "team_member"`);
        await queryRunner.query(`DROP TABLE "brand"`);
        await queryRunner.query(`DROP TABLE "room"`);
        await queryRunner.query(`DROP TABLE "about_us"`);
        await queryRunner.query(`DROP TABLE "contact_info"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
