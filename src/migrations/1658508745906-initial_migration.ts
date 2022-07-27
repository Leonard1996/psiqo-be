import {MigrationInterface, QueryRunner} from "typeorm";

export class initialMigration1658508745906 implements MigrationInterface {
    name = 'initialMigration1658508745906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`sessions\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`patientDoctorId\` int NOT NULL, \`startTime\` timestamp NOT NULL, \`endTime\` timestamp NOT NULL, \`isConfirmed\` tinyint NOT NULL DEFAULT 0, \`month\` int NOT NULL, \`link\` varchar(255) NULL, INDEX \`IDX_7257fa61600b748ebc35fe1575\` (\`month\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`patientsDoctors\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`patientId\` int NULL, \`doctorId\` int NULL, UNIQUE INDEX \`IDX_fda9458abfa45e04ba3a5859bf\` (\`patientId\`, \`doctorId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`patientProfile\` varchar(255) NULL, \`isActive\` tinyint NOT NULL DEFAULT '0', \`birthday\` timestamp NULL, \`form\` text NULL, \`role\` enum ('admin', 'subadmin', 'doctor', 'patient') NOT NULL DEFAULT 'patient', \`verificationCode\` varchar(255) NOT NULL, \`isSingle\` tinyint NULL, \`credit\` int NOT NULL DEFAULT '1', \`isFormRead\` tinyint NOT NULL DEFAULT 0, INDEX \`IDX_ace513fa30d485cfd25c11a9e4\` (\`role\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`therapists\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`cv\` varchar(255) NOT NULL, \`userId\` int NOT NULL, \`details\` json NOT NULL, UNIQUE INDEX \`REL_6401abc4b61ab212e3dde3ddf6\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD CONSTRAINT \`FK_1ad3b68bb2fb43c9173aad416ef\` FOREIGN KEY (\`patientDoctorId\`) REFERENCES \`patientsDoctors\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`patientsDoctors\` ADD CONSTRAINT \`FK_3dace85beff4fdabc190374fcf6\` FOREIGN KEY (\`patientId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`patientsDoctors\` ADD CONSTRAINT \`FK_d328aaf832fd2fbb1a7f70d13f5\` FOREIGN KEY (\`doctorId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`therapists\` ADD CONSTRAINT \`FK_6401abc4b61ab212e3dde3ddf68\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`therapists\` DROP FOREIGN KEY \`FK_6401abc4b61ab212e3dde3ddf68\``);
        await queryRunner.query(`ALTER TABLE \`patientsDoctors\` DROP FOREIGN KEY \`FK_d328aaf832fd2fbb1a7f70d13f5\``);
        await queryRunner.query(`ALTER TABLE \`patientsDoctors\` DROP FOREIGN KEY \`FK_3dace85beff4fdabc190374fcf6\``);
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP FOREIGN KEY \`FK_1ad3b68bb2fb43c9173aad416ef\``);
        await queryRunner.query(`DROP INDEX \`REL_6401abc4b61ab212e3dde3ddf6\` ON \`therapists\``);
        await queryRunner.query(`DROP TABLE \`therapists\``);
        await queryRunner.query(`DROP INDEX \`IDX_ace513fa30d485cfd25c11a9e4\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_fda9458abfa45e04ba3a5859bf\` ON \`patientsDoctors\``);
        await queryRunner.query(`DROP TABLE \`patientsDoctors\``);
        await queryRunner.query(`DROP INDEX \`IDX_7257fa61600b748ebc35fe1575\` ON \`sessions\``);
        await queryRunner.query(`DROP TABLE \`sessions\``);
    }

}
