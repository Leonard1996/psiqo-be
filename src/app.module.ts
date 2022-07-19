import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getConnectionOptions } from 'typeorm'
import { AppAuthModule } from './app-auth/app-auth.module'
import { AppCoreModule } from './app-core/app-core.module'
import { MailModule } from './app-core/mail/mail.module'
import { AppController } from './app.controller'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),
    AppAuthModule,
    MailModule,
    AppCoreModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
