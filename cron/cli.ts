import { ArgumentConfig, parse } from 'ts-command-line-args';
import { ActionResolver, init } from './Actions';

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
  init();

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
