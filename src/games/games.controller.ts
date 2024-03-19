import { Controller, Get, Param } from '@nestjs/common';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly decksService: GamesService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.decksService.findUnique(id);
  }
}
