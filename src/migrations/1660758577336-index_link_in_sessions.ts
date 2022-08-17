import { MigrationInterface, QueryRunner } from "typeorm";

export class indexLinkInSessions1660758577336 implements MigrationInterface {
    name = 'indexLinkInSessions1660758577336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX \`IDX_a69123ac0897096340e927199b\` ON \`sessions\` (\`link\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_a69123ac0897096340e927199b\` ON \`sessions\``);
    }

}
