import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class GetUserDto extends PartialType(CreateUserDto) {
  id?: string;

  nickname?: string;

  password?: string;

  title?: string;

  character?: number;

  email?: string;

  activeDeck?: string;

  packs?: string;

  collection?: string;

  rank?: number;

  dust?: number;

  gold?: number;
}
