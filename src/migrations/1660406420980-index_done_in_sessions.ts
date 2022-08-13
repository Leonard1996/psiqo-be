import { MigrationInterface, QueryRunner } from "typeorm";

export class indexDoneInSessions1660406420980 implements MigrationInterface {
    name = 'indexDoneInSessions1660406420980'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX \`IDX_5579ca0677d35d2561898e75fb\` ON \`sessions\` (\`done\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_5579ca0677d35d2561898e75fb\` ON \`sessions\``);
    }

}
