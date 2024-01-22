import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller()
export class AppController {
  @Get()
  getGlobals(@Req() req: Request): Record<string, any> {
    return req.app.locals;
  }
}
