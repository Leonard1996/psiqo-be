import { MigrationInterface, QueryRunner } from "typeorm";

export class usedIdPromoCodePromoCodeRandom1662326716933 implements MigrationInterface {
    name = 'usedIdPromoCodePromoCodeRandom1662326716933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`promoCodes\` ADD \`code\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`hasUsedPromoCode\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`hasUsedPromoCode\``);
        await queryRunner.query(`ALTER TABLE \`promoCodes\` DROP COLUMN \`code\``);
    }

}
