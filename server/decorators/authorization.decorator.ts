import { SetMetadata, applyDecorators } from '@nestjs/common';

export const READ_KEY = 'Roles_read';
export const WRITE_KEY = 'Roles_write';
export const APPEND_KEY = 'Roles_append';

export const OnlyRoles = ({
  read = [],
  write = [],
  append = [],
}: {
  read?: string[];
  write?: string[];
  append?: string[];
}) =>
  applyDecorators(
    SetMetadata(READ_KEY, read),
    SetMetadata(WRITE_KEY, write),
    SetMetadata(APPEND_KEY, append),
  );

export const JwtRequired = () =>
  applyDecorators(SetMetadata('JwtRequired', true));

export const ApiKeyRequired = () =>
  applyDecorators(SetMetadata('ApiKeyRequired', true));

export const Public = () => applyDecorators(SetMetadata('IsPublic', true));
