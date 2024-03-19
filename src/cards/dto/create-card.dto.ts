import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  @Length(9, 9)
  id: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  pantheon: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  age: string;

  @IsNotEmpty()
  @Min(0)
  @Max(20)
  cost: number;

  @IsOptional()
  @Min(0)
  @Max(20)
  atk?: number;

  @IsOptional()
  @Min(0)
  @Max(20)
  def?: number;

  @IsNotEmpty()
  @Min(0)
  @Max(4)
  rarity: number;

  @IsString()
  @IsNotEmpty()
  variant: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  text?: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  art?: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  flavor?: string;

  @IsNotEmpty()
  @Length(3, 100)
  type: string;
}
