import { Prisma } from '@prisma/client';
import { IsOptional, IsInt, Min, Max, IsString, IsUUID } from 'class-validator';

export class FindAllUsersDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number;

  @IsOptional()
  @IsUUID()
  cursor?: Prisma.UserWhereUniqueInput;

  @IsOptional()
  @IsString()
  where?: Prisma.UserWhereInput;

  @IsOptional()
  @IsString()
  orderBy?: Prisma.UserOrderByWithRelationInput;
}
