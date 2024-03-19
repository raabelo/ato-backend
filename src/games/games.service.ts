import { Injectable } from '@nestjs/common';
import { Game, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.GameCreateInput): Promise<Game> {
    return await this.prisma.game.create({
      data,
    });
  }

  async findUnique(session: string): Promise<Game> {
    return this.prisma.game.findUnique({
      where: { session },
      include: {
        players: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  async update(params: {
    session: string;
    data: Prisma.GameUpdateInput;
  }): Promise<Game> {
    const { session, data } = params;
    return await this.prisma.game.update({
      data,
      where: { session: session },
    });
  }

  async remove(where: Prisma.GameWhereUniqueInput): Promise<Game> {
    return this.prisma.game.delete({
      where,
    });
  }
}
