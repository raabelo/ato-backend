import { Module } from '@nestjs/common';
import { DecksService } from './decks.service';
import { DecksController } from './decks.controller';
import { PrismaService } from 'src/database/prisma.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [DecksController],
  providers: [DecksService, PrismaService],
  exports: [DecksService],
})
export class DecksModule {}
