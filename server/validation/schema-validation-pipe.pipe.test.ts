import { RegisterWalletDto } from '~server/root/dto/RegisterWalletDto';
import { SchemaValidationPipe } from './schema-validation-pipe.pipe';

describe('SchemaValidationPipe', () => {
  it('should be defined', () => {
    expect(new SchemaValidationPipe()).toBeDefined();
  });

  describe('Wallets DTO', () => {
    it('Should catch non-eth address for create wallet dto', async () => {
      const test = {
        address: 'adasd',
      };
      const validator = new SchemaValidationPipe();
      let failed = false;

      try {
        await validator.transform(test, {
          metatype: RegisterWalletDto,
          type: 'body',
        });
      } catch (e) {
        failed = true;
      }

      expect(failed).toBeTruthy();
    });

    it('Should catch missing address for create wallet dto', async () => {
      const test = {
        tenant: 1,
      };
      const validator = new SchemaValidationPipe();
      let failed = false;

      try {
        await validator.transform(test, {
          metatype: RegisterWalletDto,
          type: 'body',
        });
      } catch (e) {
        failed = true;
      }

      expect(failed).toBeTruthy();
    });

    it('Should allow a valid create wallet dto through', async () => {
      const test = {
        address: '0xC668583dcbDc9ae6FA3CE46462758188adfdfC24',
      } as RegisterWalletDto;
      const validator = new SchemaValidationPipe();
      let failed = false;

      try {
        await validator.transform(test, {
          metatype: RegisterWalletDto,
          type: 'body',
        });
      } catch (e) {
        failed = true;
      }

      expect(failed).toBeFalsy();
    });
  });
});
