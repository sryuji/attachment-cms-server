import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app/app.module'
import { INestApplication } from '@nestjs/common'

let app: INestApplication

async function bootstrap() {
  app = await NestFactory.create(AppModule)
  console.log('\nYou can use app instance like this.\n')
  console.log('```')
  console.log("import { app } from './src/command/repl'")
  console.log("const scopesService = app.get('ScopesService')")
  console.log('```')
}
bootstrap()

export { app }
