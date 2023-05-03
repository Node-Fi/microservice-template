import { ArgumentConfig, parse } from 'ts-command-line-args';
import { ActionResolver } from './Actions';
import { initEnvironment } from '~common/utils/initEnvironment';
import { initializeActions } from './initialize';

const argDefinition = {
  action: {
    type: String,
    required: true,
    alias: 'a',
  },
};

interface ArgsBase {
  action: string;
}

interface Args extends ArgsBase {
  [key: string]: string;
}

async function main() {
  const args = parse<Args>(argDefinition as unknown as ArgumentConfig<Args>);
  initializeActions();
  await initEnvironment();

  const action = ActionResolver.getInstance().resolveAction(args.action);

  return await action.run(args);
}

main()
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
