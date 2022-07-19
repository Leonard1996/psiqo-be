import {MigrationInterface, QueryRunner} from "typeorm";

export class sessionsMigration1652390007361 implements MigrationInterface {
    name = 'sessionsMigration1652390007361'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`sessions\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`patientDoctorId\` int NOT NULL, \`startTime\` timestamp NOT NULL, \`endTime\` timestamp NOT NULL, \`isConfirmed\` tinyint NOT NULL DEFAULT 0, \`month\` int NOT NULL, INDEX \`IDX_7257fa61600b748ebc35fe1575\` (\`month\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD CONSTRAINT \`FK_1ad3b68bb2fb43c9173aad416ef\` FOREIGN KEY (\`patientDoctorId\`) REFERENCES \`patientsDoctors\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP FOREIGN KEY \`FK_1ad3b68bb2fb43c9173aad416ef\``);
        await queryRunner.query(`DROP INDEX \`IDX_7257fa61600b748ebc35fe1575\` ON \`sessions\``);
        await queryRunner.query(`DROP TABLE \`sessions\``);
    }

}
