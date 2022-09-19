import { MigrationInterface, QueryRunner } from "typeorm";

export class rateInTherapit1663576343460 implements MigrationInterface {
    name = 'rateInTherapit1663576343460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`therapists\` ADD \`rate\` decimal(12,4) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`therapists\` DROP COLUMN \`rate\``);
    }

}
