import { MigrationInterface, QueryRunner } from "typeorm";

export class consentInPatientDoctor1659089797359 implements MigrationInterface {
    name = 'consentInPatientDoctor1659089797359'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`patientsDoctors\` ADD \`consent\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`patientsDoctors\` DROP COLUMN \`consent\``);
    }

}
