import { MigrationInterface, QueryRunner } from "typeorm";

export class resetCodeUsers1670418857323 implements MigrationInterface {
    name = 'resetCodeUsers1670418857323'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`resetPasswordCode\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`resetPasswordCode\``);
    }

}
