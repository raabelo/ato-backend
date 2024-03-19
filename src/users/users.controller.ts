import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { FindAllUsersDto } from './dto/findall-user.dto';
import * as bcrypt from 'bcrypt';
import { Public } from 'src/decorators/public.decorator';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  async create(@Body() reqBody: CreateUserDto): Promise<GetUserDto> {
    const userData = {
      ...reqBody,
      id: randomUUID(),
      email: reqBody.email.toLowerCase(),
      title: 'Novato',
      character: 0,
      activeDeck: '',
      packs: '',
      collection: '',
      role: 'USER',
      password: bcrypt.hashSync(reqBody.password, 10),
    };
    const user = await this.usersService.create(userData);
    const userDto = this.usersService.treatUser(user);
    return userDto;
  }

  @Get()
  async findAll(@Query() queryParams: FindAllUsersDto): Promise<GetUserDto[]> {
    const users = await this.usersService.findAll(queryParams);
    const usersDto = users.map((user) => this.usersService.treatUser(user));
    return usersDto;
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('fields') fields: string,
  ): Promise<GetUserDto | null> {
    const user = await this.usersService.findOne({ id }, fields);
    const userDto = this.usersService.treatUser(user);
    return userDto;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<GetUserDto> {
    const user = await this.usersService.update({
      where: { id },
      data: { ...updateUserDto, email: updateUserDto.email?.toLowerCase() },
    });
    const userDto = this.usersService.treatUser(user);
    return userDto;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<GetUserDto> {
    const user = await this.usersService.remove({ id });
    const userDto = this.usersService.treatUser(user);
    return userDto;
  }

  @Post(':id/collection')
  async updateCollection(
    @Param('id') id: string,
    @Body() newCard: UpdateCollectionDto,
  ): Promise<GetUserDto> {
    const user = await this.usersService.addCardToCollection({
      where: { id },
      data: newCard.cardId,
    });
    const userDto = this.usersService.treatUser(user);
    return userDto;
  }
}
