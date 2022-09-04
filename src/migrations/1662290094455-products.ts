import { MigrationInterface, QueryRunner } from "typeorm";

export class products1662290094455 implements MigrationInterface {
    name = 'products1662290094455'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`products\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`typeOfSession\` varchar(255) NOT NULL, \`numberOfSessions\` int NOT NULL, \`price\` int NOT NULL, \`taxes\` varchar(255) NOT NULL, \`status\` tinyint NOT NULL, \`from\` timestamp NOT NULL, \`until\` timestamp NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`products\``);
    }

}
