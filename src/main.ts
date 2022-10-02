require('dotenv').config()
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import 'reflect-metadata'
import { NestExpressApplication } from '@nestjs/platform-express'
import { localAuthMiddleware } from './middleware/local_auth.middleware'
import { join } from 'path'
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.useStaticAssets(join(__dirname, '..', 'files'))
  app.use(localAuthMiddleware)
  app.enableCors({
    origin: 'http://ec2-34-244-164-93.eu-west-1.compute.amazonaws.com:4500',
    credentials: true,
  })

  await app.listen(PORT)
  console.log(`Listening at: http://localhost:${process.env.PORT}`)
}
bootstrap()
