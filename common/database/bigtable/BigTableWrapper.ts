/**
 * @fileoverview BigTableWrapper is a wrapper around the BigTable API.
 * It provides a simple interface for reading and writing data to BigTable.
 * It provides an easy interface for accessing time-series data in BigTable
 * It abstracts away the complex logic of our bucket management system.
 */

import { Instance } from '@google-cloud/bigtable';
import { formatNumberForBigTableColumn } from '~common/utils/reverseNumbers';
import { UnixSeconds } from '~common/utils/unixSeconds';

export class BigTableWrapper {
  constructor(private instance: Instance) {
    // Empty constructor
  }

  get bigTable() {
    return this.instance;
  }

  // These create a PART of the key.  Timestamp should never be the whole key.
  dailyTimestampKey(unixTimestamp: number): string {
    const dayBucket = Math.floor(unixTimestamp / (60 * 60 * 24));
    return `day:${formatNumberForBigTableColumn(dayBucket)}`;
  }

  // These create a PART of the key.  Timestamp should never be the whole key.
  monthlyTimestampKey(unixTimestamp: number): string {
    const monthBucket = Math.floor(unixTimestamp / (60 * 60 * 24 * 30));
    return `month:${formatNumberForBigTableColumn(monthBucket)}`;
  }

  dailyBucketColumnKey(unixTimestamp: number): string {
    const dayPortion =
      Math.floor(unixTimestamp / (60 * 60 * 24)) * (60 * 60 * 24);
    const seconds =
      Math.floor(
        (unixTimestamp - dayPortion) /
          UnixSeconds.toSeconds({
            minutes: 5,
          }),
      ) *
      UnixSeconds.toSeconds({
        minutes: 5,
      });
    const minute = seconds / UnixSeconds.toSeconds({ minutes: 1 });

    return formatNumberForBigTableColumn(minute, 60 * 24);
  }

  monthlyBucketColumnKey(unixTimestamp: number): string {
    const monthPortion =
      Math.floor(unixTimestamp / (60 * 60 * 24 * 30)) * (60 * 60 * 24 * 30);

    const day = UnixSeconds.roundToNearest('1d', unixTimestamp - monthPortion);
    return formatNumberForBigTableColumn(day, 30);
  }

  async fetchDailyBuckets<T, V = string>(
    tableName: string,
    prefix: string,
    family: string,
    start: number,
    end: number,
    parseData: (v: { cells: { value: V }[]; unixTimestamp: number }) => T,
  ): Promise<T[]> {
    const table = this.instance.table(tableName);
    const startDayBucket = Math.floor(start / (60 * 60 * 24));
    const endDayBucket = Math.floor(end / (60 * 60 * 24));

    // For daily accesses we are much more likely to access multiple rows
    // So we use start and end rather than an array of keys
    if (startDayBucket !== endDayBucket) {
      const [data] = await table.getRows({
        start: `${prefix}#day:${formatNumberForBigTableColumn(startDayBucket)}`,
        end: `${prefix}#day:${formatNumberForBigTableColumn(endDayBucket)}`,
        filter: {
          column: {
            family,
          },
        },
      });

      // We use the day offset as the column names
      // So the full timestamp for each price entry is going to be the truncated day bucket + the offset
      return data.flatMap((row, dayNumber) => {
        const data: {
          [s: string]: { [offset: number]: { value: V }[] };
        } = row.data;

        if (data[family] === undefined) {
          console.warn(
            `No data for ${family} in ${tableName} for ${prefix}#${formatNumberForBigTableColumn(
              startDayBucket + dayNumber,
            )}`,
          );
          return [];
        }

        return Object.entries(data[family]).map(([offset, cells]) =>
          parseData({
            cells,
            unixTimestamp: UnixSeconds.toSeconds({
              days: startDayBucket + dayNumber,
              seconds: Number(offset),
            }),
          }),
        );
      });
    }

    const [row] = await table
      .row(`${prefix}#day:${formatNumberForBigTableColumn(startDayBucket)}`)
      .get();
    const data = row.data as {
      [cells: string]: { [offset: number]: { value: V }[] };
    };

    // We use the day offset as the column names
    // So the full timestamp for each price entry is going to be the truncated day bucket + the offset
    return Object.entries(data[family]).map(([offset, cells]) =>
      parseData({
        unixTimestamp: UnixSeconds.toSeconds({
          days: startDayBucket,
          seconds: Number(offset),
        }),
        cells,
      }),
    );
  }

  async fetchMonthlyBuckets<T, V = string>(
    tableName: string,
    prefix: string,
    family: string,
    start: number,
    end: number,
    parseData: (v: { cells: { value: V }[]; unixTimestamp: number }) => T,
  ): Promise<T[]> {
    const table = this.instance.table(tableName);
    const startMonthBucket = Math.floor(start / (60 * 60 * 24 * 30));
    const endMonthBucket = Math.floor(end / (60 * 60 * 24 * 30));

    // For monthly accesses we are much more likely to access multiple rows
    // So we use start and end rather than an array of keys
    if (startMonthBucket !== endMonthBucket) {
      const [data] = await table.getRows({
        start: `${prefix}#month:${formatNumberForBigTableColumn(
          startMonthBucket,
        )}`,
        end: `${prefix}#month:${formatNumberForBigTableColumn(endMonthBucket)}`,
        filter: {
          column: {
            family,
          },
        },
      });

      // We use the day offset as the column names
      // So the full timestamp for each price entry is going to be the truncated day bucket + the offset
      return data.flatMap((row, monthNumber) => {
        const data: {
          [s: string]: { [offset: number]: { value: V }[] };
        } = row.data;

        if (data[family] === undefined) {
          console.warn(
            `No data for ${family} in ${tableName} for ${prefix}#${formatNumberForBigTableColumn(
              startMonthBucket + monthNumber,
            )}`,
          );
          return [];
        }

        return Object.entries(data[family]).map(([offset, cells]) =>
          parseData({
            cells,
            unixTimestamp: UnixSeconds.toSeconds({
              days: startMonthBucket + monthNumber,
              seconds: Number(offset),
            }),
          }),
        );
      });
    }

    const [row] = await table
      .row(`${prefix}#month:${formatNumberForBigTableColumn(startMonthBucket)}`)
      .get();
    const data = row.data as {
      [cells: string]: { [offset: number]: { value: V }[] };
    };

    // We use the day offset as the column names
    // So the full timestamp for each price entry is going to be the truncated day bucket + the offset
    return Object.entries(data[family]).map(([offset, cells]) =>
      parseData({
        unixTimestamp: UnixSeconds.toSeconds({
          days: startMonthBucket,
          seconds: Number(offset),
        }),
        cells,
      }),
    );
  }
}
