import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { GetUserDto } from './dto/get-user.dto';
import { CardsService } from 'src/cards/cards.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cardsService: CardsService,
  ) {}

  treatUser(user: GetUserDto): GetUserDto {
    /* eslint-disable @typescript-eslint/no-unused-vars*/
    const { password, ...treatedUser } = user;
    return treatedUser;
  }

  async create(data: Prisma.UserCreateInput): Promise<GetUserDto> {
    try {
      const user = await this.prisma.user.create({
        data,
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        throw new ConflictException('Email already exists');
      } else if (
        error.code === 'P2002' &&
        error.meta?.target?.includes('nickname')
      ) {
        throw new ConflictException('Nickname already exists');
      } else {
        throw error;
      }
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findUnique(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<GetUserDto | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    fields: string,
  ): Promise<GetUserDto | null> {
    const allowedFields = [
      'id',
      'nickname',
      'title',
      'character',
      'activeDeck',
      'packs',
      'collection',
      'rank',
      'dust',
      'gold',
      'email',
      'role',
    ];

    let selectFields: Prisma.UserSelect = {};
    let fieldList = [];
    if (fields) {
      fieldList = fields.split(';');
      selectFields = fieldList.reduce((acc, curr) => {
        acc[curr] = true;
        return acc;
      }, {});
    }
    const invalidFields = fieldList.filter(
      (field) => !allowedFields.includes(field),
    );

    if (invalidFields.length > 0) {
      throw new BadRequestException(
        `Invalid fields: ${invalidFields.join(', ')}`,
      );
    }

    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      select: Object.values(selectFields).length === 0 ? null : selectFields,
    });
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<GetUserDto> {
    const { where, data } = params;
    try {
      const user = await this.prisma.user.update({
        data,
        where,
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        throw new ConflictException('Email already exists');
      } else if (
        error.code === 'P2002' &&
        error.meta?.target?.includes('nickname')
      ) {
        throw new ConflictException('Nickname already exists');
      } else {
        throw error;
      }
    }
  }

  async remove(where: Prisma.UserWhereUniqueInput): Promise<GetUserDto> {
    return this.prisma.user.delete({
      where,
    });
  }

  async addCardToCollection(params: {
    where: Prisma.UserWhereUniqueInput;
    data: string;
  }): Promise<{ collection: string }> {
    const { where, data } = params;
    const user = await this.findUnique(where);
    if (!user) {
      throw new NotFoundException();
    }
    const id = await this.cardsService.findOne({ id: data });
    if (!id) {
      throw new NotFoundException();
    }

    const collection = user.collection;
    let cards = collection ? JSON.parse(collection) : [];

    if (
      cards.some((item: { id: string; quantity: number }) => item.id === data)
    ) {
      cards = cards.map((card: { id: string; quantity: number }) => {
        if (card.id === data) {
          return { ...card, quantity: card.quantity + 1 };
        } else {
          return card;
        }
      });
    } else {
      cards.push({ id: data, quantity: 1 });
    }

    const newUser = await this.prisma.user.update({
      data: {
        collection: JSON.stringify(cards),
      },
      where,
    });

    return newUser;
  }
}
