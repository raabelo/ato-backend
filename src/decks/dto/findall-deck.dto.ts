import { Prisma } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class FindAllDecksDto {
  @IsOptional()
  @IsString()
  ownerId?: Prisma.DeckWhereInput;
}
