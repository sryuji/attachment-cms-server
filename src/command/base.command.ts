import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app/app.module'
import { INestApplication } from '@nestjs/common'

export abstract class BaseCommand {
  protected app: INestApplication

  constructor(app?: INestApplication) {
    this.app = app
  }

  public async run(): Promise<void> {
    await this.bootstrap()
    await this.perform()
    this.terminate()
  }

  public abstract perform(): Promise<void>

  protected async bootstrap() {
    if (this.app) return
    this.app = await NestFactory.create(AppModule)
  }
  protected async terminate() {
    return
  }
}
