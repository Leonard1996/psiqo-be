import { MigrationInterface, QueryRunner } from "typeorm";

export class initialMigration1652306072662 implements MigrationInterface {
    name = 'initialMigration1652306072662'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`patientsDoctors\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`patientId\` int NULL, \`doctorId\` int NULL, UNIQUE INDEX \`IDX_fda9458abfa45e04ba3a5859bf\` (\`patientId\`, \`doctorId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`patientsDoctors\` ADD CONSTRAINT \`FK_3dace85beff4fdabc190374fcf6\` FOREIGN KEY (\`patientId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`patientsDoctors\` ADD CONSTRAINT \`FK_d328aaf832fd2fbb1a7f70d13f5\` FOREIGN KEY (\`doctorId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`patientsDoctors\` DROP FOREIGN KEY \`FK_d328aaf832fd2fbb1a7f70d13f5\``);
        await queryRunner.query(`ALTER TABLE \`patientsDoctors\` DROP FOREIGN KEY \`FK_3dace85beff4fdabc190374fcf6\``);
        await queryRunner.query(`DROP INDEX \`IDX_fda9458abfa45e04ba3a5859bf\` ON \`patientsDoctors\``);
        await queryRunner.query(`DROP TABLE \`patientsDoctors\``);
    }

}
