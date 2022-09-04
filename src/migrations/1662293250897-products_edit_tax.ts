import { MigrationInterface, QueryRunner } from "typeorm";

export class productsEditTax1662293250897 implements MigrationInterface {
    name = 'productsEditTax1662293250897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`taxes\` \`tax\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`tax\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`tax\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`tax\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`tax\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`tax\` \`taxes\` varchar(255) NOT NULL`);
    }

}
