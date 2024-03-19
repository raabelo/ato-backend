import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DecksService } from './decks.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { FindAllDecksDto } from './dto/findall-deck.dto';
import { Deck, Prisma } from '@prisma/client';

@Controller('decks')
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @Post()
  create(@Body() createDeckDto: CreateDeckDto, @Query('user') userId: string) {
    return this.decksService.create(createDeckDto, userId);
  }

  @Get()
  findAll(@Query() queryParams: FindAllDecksDto) {
    return this.decksService.findAll(queryParams.ownerId as string);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.decksService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDeckDto: UpdateDeckDto,
  ): Promise<Deck> {
    return this.decksService.update({
      where: { id },
      data: updateDeckDto as Prisma.DeckUpdateInput,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.decksService.remove(+id);
  }
}
