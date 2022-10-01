import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { join } from 'path'
import { AppAuthModule } from './app-auth/app-auth.module'
import { AppCoreModule } from './app-core/app-core.module'
import { MailModule } from './app-core/mail/mail.module'
import { AppController } from './app.controller'
import { ormconfiguration } from './ormconfig'

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfiguration as TypeOrmModuleOptions),
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    AppAuthModule,
    MailModule,
    AppCoreModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
