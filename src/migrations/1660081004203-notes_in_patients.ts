import { MigrationInterface, QueryRunner } from "typeorm";

export class notesInPatients1660081004203 implements MigrationInterface {
    name = 'notesInPatients1660081004203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`patients\` ADD \`notes\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`patients\` DROP COLUMN \`notes\``);
    }

}
