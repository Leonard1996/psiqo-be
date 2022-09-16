import { MigrationInterface, QueryRunner } from "typeorm";

export class orders1663325363230 implements MigrationInterface {
    name = 'orders1663325363230'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`orders\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`purchaserType\` varchar(255) NULL, \`productId\` int NOT NULL, \`userId\` int NOT NULL, \`sessionType\` varchar(255) NULL, \`paid\` decimal(12,4) NOT NULL, \`fee\` decimal(12,4) NOT NULL, \`details\` json NULL, \`promoCode\` varchar(255) NULL, \`giftCard\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_8624dad595ae567818ad9983b33\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_151b79a83ba240b0cb31b2302d1\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_151b79a83ba240b0cb31b2302d1\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_8624dad595ae567818ad9983b33\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
    }

}
