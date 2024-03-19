import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getServerStatus() {
    return { message: 'server is running' };
  }
}
