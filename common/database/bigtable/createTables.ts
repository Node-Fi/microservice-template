import { config } from 'dotenv';
import { getBigTableInstance } from '../bigTable';

config({
  path: `${__dirname}/../../.env.${process.env.NODE_ENV}`,
});

const instanceId = process.env.BIGTABLE_INSTANCE_ID ?? 'holdings-domain';

export enum BigTableNames {
  PortfolioDailyBuckets = 'portfolio-daily-buckets',
  PortfolioMonthlyBuckets = 'portfolio-monthly-buckets',
  PortfolioWeeklyBuckets = 'portfolio-weekly-buckets',
  TokenPricesDailyBuckets = 'token-prices-daily-buckets',
  TokenPricesMonthlyBuckets = 'token-prices-monthly-buckets',
  TokenPricesWeeklyBuckets = 'token-prices-weekly-buckets',
}

export const bigTableNames: BigTableNames[] = Object.values(BigTableNames);

export async function createTables() {
  console.log(instanceId);
  const instance = await getBigTableInstance(instanceId);
  await Promise.all(
    bigTableNames.map(async (name) => {
      const table = instance.table(name);

      const exists = await table.exists();
      if (exists) {
        console.log(`Table ${name} already exists`);
        return;
      }

      await table.create();
    }),
  );
}

createTables().catch((e) => {
  console.error(e);
  process.exit(1);
});
