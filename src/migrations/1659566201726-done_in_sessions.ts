import { MigrationInterface, QueryRunner } from "typeorm";

export class doneInSessions1659566201726 implements MigrationInterface {
    name = 'doneInSessions1659566201726'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD \`done\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP COLUMN \`done\``);
    }

}
