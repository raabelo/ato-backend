import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/database/prisma.service';
import { randomUUID } from 'crypto';
import { Deck, Prisma } from '@prisma/client';

@Injectable()
export class DecksService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
  ) {}
  async create(createDeckDto: CreateDeckDto, userId: string) {
    if (!userId) {
      throw new NotFoundException('User not provided');
    }
    const user = await this.usersService.findUnique({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const createdDeck = await this.prisma.deck.create({
      data: {
        id: randomUUID(),
        name: createDeckDto.name,
        owner: { connect: { id: userId } },
        cards: JSON.stringify(createDeckDto.cards),
      },
    });

    return createdDeck;
  }

  async findAll(params: string): Promise<Deck[]> {
    return this.prisma.deck.findMany({
      where: {
        ownerId: params,
      },
    });
  }

  async findOne(id: number) {
    return `This action returns a #${id} deck`;
  }

  async update(params: {
    where: Prisma.DeckWhereUniqueInput;
    data: Prisma.DeckUpdateInput;
  }): Promise<Deck> {
    const { where, data } = params;
    const deck = await this.prisma.deck.findUnique({
      where,
    });
    if (!deck) {
      throw new NotFoundException();
    }
    return this.prisma.deck.update({
      data: { name: data.name, cards: JSON.stringify(data.cards) },
      where,
    });
  }

  async remove(id: number) {
    return `This action removes a #${id} deck`;
  }
}
