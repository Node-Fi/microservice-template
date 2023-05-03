import * as child_process from 'child_process';
import { subscribersDeploymentConfig } from '../subscribers/topics';

function main() {
  const subs = Object.entries(subscribersDeploymentConfig)
    .map(([topic, { exclude }]) => {
      if (exclude) {
        return;
      }

      return topic;
    })
    .filter((v) => !!v);

  subs.map((topic) => {
    console.log('------------------');
    console.log(`Creating subscription for topic ${topic}`);
    console.log(
      child_process.execSync(`${__dirname}/subscribers.sh ${topic}`).toString(),
    );
    console.log(`✅ Created subscription for topic ${topic}`);
    console.log('------------------\n');
  });
}

main();
