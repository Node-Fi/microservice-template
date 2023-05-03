export const reverseTokenId = (id: number) => {
  const max_id = 2 ** 32 - 1;
  const reversed = (max_id - id).toFixed(0);
  return `${'0'.repeat(max_id.toFixed().length - reversed.length)}${reversed}`;
};

export const formatNumberForBigTableColumn = (
  num: number,
  max = Number.MAX_SAFE_INTEGER,
) => `${'0'.repeat(max.toFixed().length - num.toFixed().length)}${num}`;
