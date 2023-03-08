import {
  IsEthereumAddress,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class TokenFilter {
  @IsNumberString()
  @IsOptional()
  tid?: number;

  @IsEthereumAddress()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  symbol?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
