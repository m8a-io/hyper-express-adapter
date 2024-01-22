import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ErrorsController } from './errors.controller';

@Module({
  imports: [],
  controllers: [AppController, ErrorsController],
  providers: [AppService],
})
export class AppModule {}
