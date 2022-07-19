import {MigrationInterface, QueryRunner} from "typeorm";

export class therapistMigration1656159833159 implements MigrationInterface {
    name = 'therapistMigration1656159833159'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`therapists\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`cv\` varchar(255) NOT NULL, \`userId\` int NOT NULL, \`details\` json NOT NULL, UNIQUE INDEX \`REL_6401abc4b61ab212e3dde3ddf6\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`therapists\` ADD CONSTRAINT \`FK_6401abc4b61ab212e3dde3ddf68\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`therapists\` DROP FOREIGN KEY \`FK_6401abc4b61ab212e3dde3ddf68\``);
        await queryRunner.query(`DROP INDEX \`REL_6401abc4b61ab212e3dde3ddf6\` ON \`therapists\``);
        await queryRunner.query(`DROP TABLE \`therapists\``);
    }

}
