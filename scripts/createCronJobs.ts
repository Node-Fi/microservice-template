import { config } from '../cron/config';

import * as child_process from 'child_process';
import path from 'path';

function main() {
  const cronJobs = Object.entries(config)
    .map(([name, { schedule, exclude }]) => {
      if (exclude) {
        return;
      }

      return {
        name,
        schedule,
      };
    })
    .filter((v) => !!v);

  cronJobs.map(({ name, schedule }) => {
    console.log('------------------');
    console.log(`Creating cron job for ${name} with schedule ${schedule}`);
    console.log(
      child_process
        .execSync(`${path.join(__dirname, './cron.sh')} ${name} "${schedule}"`)
        .toString(),
    );
    console.log(`✅ Created cron job for ${name} with schedule ${schedule}`);
    console.log('------------------\n');
  });
}

main();
