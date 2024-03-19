import { PartialType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-card.dto';
import { IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class UpdateCardDto extends PartialType(CreateCardDto) {
  @IsString()
  @IsOptional()
  @Length(9, 9)
  id?: string;

  @IsString()
  @IsOptional()
  @Length(3, 100)
  name?: string;

  @IsString()
  @IsOptional()
  @Length(3, 100)
  title?: string;

  @IsString()
  @IsOptional()
  @Length(3, 100)
  pantheon?: string;

  @IsString()
  @IsOptional()
  @Length(3, 100)
  age?: string;

  @IsOptional()
  @Min(0)
  @Max(20)
  cost?: number;

  @Min(0)
  @Max(20)
  atk?: number;

  @Min(0)
  @Max(20)
  def?: number;

  @IsOptional()
  @Min(0)
  @Max(4)
  rarity?: number;

  @IsString()
  @IsOptional()
  variant?: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  text?: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  art?: string;

  @IsString()
  @Length(0, 1000)
  flavor?: string;

  @IsOptional()
  @Length(3, 100)
  type?: string;
}
