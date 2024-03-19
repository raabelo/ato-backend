import { Module } from '@nestjs/common';
import { GamesGateway } from './games.gateway';
import { QueueService } from './queue.service';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { PrismaService } from 'src/database/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { DecksModule } from 'src/decks/decks.module';
import { CardsModule } from 'src/cards/cards.module';

@Module({
  imports: [UsersModule, DecksModule, CardsModule],
  controllers: [GamesController],
  providers: [GamesGateway, QueueService, GamesService, PrismaService],
  exports: [GamesService],
})
export class GamesModule {}
