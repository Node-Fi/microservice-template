import {
  IsBoolean,
  IsDefined,
  IsEthereumAddress,
  IsJSON,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegisterWalletDto {
  @IsString()
  @IsDefined()
  @IsEthereumAddress({
    message: 'The address must be a valid Ethereum address',
  })
  address: string;

  @IsBoolean()
  @IsOptional()
  requestNotTrack?: boolean;

  @IsJSON()
  @IsOptional()
  trackingInfo?: Record<string, string>;

  @IsJSON()
  @IsOptional()
  tenantInfo?: Record<string, string>;
}
