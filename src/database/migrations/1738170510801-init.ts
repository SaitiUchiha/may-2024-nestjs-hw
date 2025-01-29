import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1738170510801 implements MigrationInterface {
    name = 'Init1738170510801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "lastName" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastName"`);
    }

}
