import { Injectable, PipeTransform } from '@nestjs/common';
import { GenericException } from '~server/exceptions';

@Injectable()
export class ParseJSONPipe<T extends Record<string, any>>
  implements PipeTransform<any>
{
  constructor(private fields?: (keyof T)[]) {}

  transform(value?: string | T): T {
    if (!value) return undefined;
    if (!this.fields && typeof value === 'string')
      return JSON.parse(value) as T;
    if (!this.fields && typeof value !== 'string') {
      throw new GenericException('Invalid JSON');
    }
    if (typeof value !== 'string')
      this.fields
        .filter((f) => !!value[f])
        .forEach((f) => ((value[f] as string) = JSON.parse(value[f])));
    return value as T;
  }
}
