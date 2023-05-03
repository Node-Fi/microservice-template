export enum TaskName {
  TestAction = 'test-action',
}

export const config: {
  [key in TaskName]: {
    exclude?: boolean;
    schedule: string;
  };
} = {
  [TaskName.TestAction]: {
    schedule: '*/5 * * * *',
    exclude: true,
  },
};
