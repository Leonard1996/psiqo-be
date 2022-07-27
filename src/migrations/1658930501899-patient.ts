import { MigrationInterface, QueryRunner } from "typeorm";

export class patient1658930501899 implements MigrationInterface {
    name = 'patient1658930501899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`patients\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`details\` json NOT NULL, \`status\` varchar(255) NOT NULL DEFAULT 'registrato', \`freeTrial\` varchar(255) NOT NULL DEFAULT 'da programmare', \`consent\` varchar(255) NULL, \`newsletter\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`REL_2c24c3490a26d04b0d70f92057\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD \`notes\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`patients\` ADD CONSTRAINT \`FK_2c24c3490a26d04b0d70f92057a\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`patients\` DROP FOREIGN KEY \`FK_2c24c3490a26d04b0d70f92057a\``);
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP COLUMN \`notes\``);
        await queryRunner.query(`DROP INDEX \`REL_2c24c3490a26d04b0d70f92057\` ON \`patients\``);
        await queryRunner.query(`DROP TABLE \`patients\``);
    }

}
