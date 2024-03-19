import { IsString, Length } from 'class-validator';

export class UpdateCollectionDto {
  @IsString()
  @Length(9, 9)
  cardId: string;
}
