import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { GamesModule } from './games/games.module';
import { PrismaService } from './database/prisma.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { DecksModule } from './decks/decks.module';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 100000, // 1.66 minutes
        limit: 500, // 100 requests
      },
    ]),
    UsersModule,
    AuthModule,
    GamesModule,
    DecksModule,
    CardsModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
