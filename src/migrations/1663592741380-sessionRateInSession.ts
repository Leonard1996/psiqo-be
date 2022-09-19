import { MigrationInterface, QueryRunner } from "typeorm";

export class sessionRateInSession1663592741380 implements MigrationInterface {
    name = 'sessionRateInSession1663592741380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD \`sessionRate\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP COLUMN \`sessionRate\``);
    }

}
