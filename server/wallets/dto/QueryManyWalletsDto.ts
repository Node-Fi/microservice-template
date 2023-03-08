import { IsNumberString, IsOptional } from 'class-validator';

export class QueryManyWalletsDto {
  @IsNumberString()
  @IsOptional()
  page?: number;

  @IsNumberString()
  @IsOptional()
  perPage?: number;
}
