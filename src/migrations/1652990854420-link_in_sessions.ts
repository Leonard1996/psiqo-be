import {MigrationInterface, QueryRunner} from "typeorm";

export class linkInSessions1652990854420 implements MigrationInterface {
    name = 'linkInSessions1652990854420'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD \`link\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP COLUMN \`link\``);
    }

}
