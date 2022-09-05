import { MigrationInterface, QueryRunner } from "typeorm";

export class giftCards1662385471544 implements MigrationInterface {
    name = 'giftCards1662385471544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`giftCards\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`price\` int NOT NULL, \`from\` timestamp NOT NULL, \`until\` timestamp NOT NULL, \`code\` varchar(255) NOT NULL, \`redemptionDate\` timestamp NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`giftCards\``);
    }

}
