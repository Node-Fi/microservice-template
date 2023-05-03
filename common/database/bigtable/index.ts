import { Bigtable } from '@google-cloud/bigtable';

export async function getBigTableInstance(instanceId = 'holdings-domain') {
  const bigtable = new Bigtable({
    projectId: 'node-wallet',
  });
  const instance = bigtable.instance(instanceId);

  return instance;
}

export async function getBigTableTable(
  tableName: string,
  instanceId = 'holdings-domain',
) {
  const instance = await getBigTableInstance(instanceId);
  const table = instance.table(tableName);

  return table;
}
