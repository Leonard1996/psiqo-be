import { MigrationInterface, QueryRunner } from "typeorm";

export class promoCodes1662324385155 implements MigrationInterface {
    name = 'promoCodes1662324385155'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`promoCodes\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`numberOfSessions\` int NOT NULL, \`flatDiscount\` int NOT NULL, \`percentageDiscount\` int NOT NULL, \`status\` tinyint NOT NULL, \`from\` timestamp NOT NULL, \`until\` timestamp NOT NULL, \`usability\` varchar(255) NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`promoCodes\` ADD CONSTRAINT \`FK_5b44bf3af129389b882c723d3d2\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`promoCodes\` DROP FOREIGN KEY \`FK_5b44bf3af129389b882c723d3d2\``);
        await queryRunner.query(`DROP TABLE \`promoCodes\``);
    }

}
