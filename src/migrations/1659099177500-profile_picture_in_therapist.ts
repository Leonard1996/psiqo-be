import { MigrationInterface, QueryRunner } from "typeorm";

export class profilePictureInTherapist1659099177500 implements MigrationInterface {
    name = 'profilePictureInTherapist1659099177500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`therapists\` ADD \`profilePicture\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`therapists\` DROP COLUMN \`profilePicture\``);
    }

}
