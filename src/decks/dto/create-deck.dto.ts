import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class CreateDeckDto {
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
