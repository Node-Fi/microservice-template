import { getAddress } from '@ethersproject/address';
import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class EthAddressTransformationPipe<T extends { [k: string]: any }>
  implements PipeTransform
{
  constructor(private fields: (keyof T)[] = []) {}

  transform(value: T) {
    this.fields.forEach((f) => ((value[f] as string) = getAddress(value[f])));
    return value;
  }
}
