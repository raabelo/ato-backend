import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
// import { UpdateCardDto } from './dto/update-card.dto';
import Age, { isAge } from 'src/types/Age';
import Variant, { isVariant } from 'src/types/Variant';
import { isCardType } from 'src/types/CardType';
import { isPantheon } from 'src/types/Pantheon';
import { PrismaService } from 'src/database/prisma.service';
import { Card, Prisma } from '@prisma/client';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  handleVariant = (variant: Variant): string => {
    switch (variant) {
      case 'Padrão':
        return 'Standard';
      case 'Promocional':
        return 'Promo';
      case 'Holográfica':
        return 'Holo';
      default:
        return 'Standard';
    }
  };
  handleCardset = (id: string): string => {
    switch (id?.split('-')[0]) {
      case '01':
        return 'Genesis';
      default:
        return '';
    }
  };
  handleAge = (age: Age): string => {
    switch (age) {
      case 'Pirata':
        return 'Pirate';
      case 'Faroeste':
        return 'Western';
      default:
        return age;
    }
  };

  getArtURL(id: string, age: Age, variant: Variant, name: string): string {
    return `https://raw.githubusercontent.com/raabelo/resources/main/images/ato/artwork/${(
      this.handleCardset(id) +
      '_' +
      this.handleAge(age) +
      '_' +
      name +
      '_' +
      this.handleVariant(variant)
    ).toLowerCase()}.png`;
  }

  async create(createCardDto: CreateCardDto) {
    if (!isAge(createCardDto.age)) {
      throw new BadRequestException(`Invalid field Age`);
    }
    if (!isCardType(createCardDto.type)) {
      throw new BadRequestException(`Invalid field Type`);
    }
    if (!isPantheon(createCardDto.pantheon)) {
      throw new BadRequestException(`Invalid field Pantheon`);
    }
    if (!isVariant(createCardDto.variant)) {
      throw new BadRequestException(`Invalid field Variant`);
    }
    const cardData: Prisma.CardCreateInput = {
      ...createCardDto,
      art: this.getArtURL(
        createCardDto.id,
        createCardDto.age,
        createCardDto.variant,
        createCardDto.name,
      ),
    };
    try {
      const data: Prisma.CardCreateInput = cardData;
      const card = await this.prisma.card.create({
        data,
      });
      return card;
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('id')) {
        throw new ConflictException('Id already exists');
      } else {
        throw error;
      }
    }
  }

  // async findAll() {
  //   return `This action returns all cards`;
  // }

  async findOne(
    userWhereUniqueInput: Prisma.CardWhereUniqueInput,
  ): Promise<Card | null> {
    return this.prisma.card.findUnique({
      where: userWhereUniqueInput,
    });
  }

  // async update(id: string, updateCardDto: UpdateCardDto) {
  //   return `This action updates a #${id} card`;
  // }

  // async remove(id: string) {
  //   return `This action removes a #${id} card`;
  // }
}
