import { getBigTableInstance } from '../bigTable';
import { bigTableNames } from '../bigtable/createTables';

export async function initBigTablEmulator() {
  console.log('Starting bigtable emulator instance');

  const bigTable = await getBigTableInstance();

  await Promise.all(
    bigTableNames.map(async (name) => {
      const table = bigTable.table(name);
      const [tableExists] = await table.exists();
      if (!tableExists) await table.create();

      const priceFamily = table.family('prices');
      const [priceFamilyExists] = await priceFamily.exists();

      if (!priceFamilyExists) {
        await priceFamily.create();
      }
    }),
  );
  console.log('Bigtable emulator instance running');
}
