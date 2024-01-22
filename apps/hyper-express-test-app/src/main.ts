import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  HyperExpressAdapter,
  NestHyperExpressApplication,
} from 'platform-hyper-express';

async function bootstrap() {
  const app = await NestFactory.create<NestHyperExpressApplication>(
    AppModule,
    new HyperExpressAdapter(),
  );
  await app.listen(3001);
}
bootstrap();
