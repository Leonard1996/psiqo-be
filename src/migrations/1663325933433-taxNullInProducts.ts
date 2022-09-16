import { MigrationInterface, QueryRunner } from "typeorm";

export class taxNullInProducts1663325933433 implements MigrationInterface {
    name = 'taxNullInProducts1663325933433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`tax\` \`tax\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`tax\` \`tax\` int NOT NULL`);
    }

}
