import { MigrationInterface, QueryRunner } from "typeorm";

export class giftCardRedepmtionDateNullable1662387876937 implements MigrationInterface {
    name = 'giftCardRedepmtionDateNullable1662387876937'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`giftCards\` CHANGE \`redemptionDate\` \`redemptionDate\` timestamp NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`giftCards\` CHANGE \`redemptionDate\` \`redemptionDate\` timestamp NOT NULL`);
    }

}
