import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  //   IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
// import { Deck, Game } from '@prisma/client';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  character?: number;

  @IsOptional()
  @IsEmail()
  @IsString()
  email?: string;

  @IsOptional()
  @MinLength(8)
  @MaxLength(100)
  password?: string;

  @IsOptional()
  @IsString()
  @Max(200)
  activeDeck?: string;

  @IsOptional()
  @IsString()
  packs?: string;

  @IsOptional()
  @IsString()
  collection?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  rank?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  dust?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1000000000)
  gold?: number;
}
