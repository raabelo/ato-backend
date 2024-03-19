import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateDeckDto } from './create-deck.dto';

export class UpdateDeckDto extends PartialType(CreateDeckDto) {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  name: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(60)
  @ArrayMaxSize(60)
  cards: string[];
}
