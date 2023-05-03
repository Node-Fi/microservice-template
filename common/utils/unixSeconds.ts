export class UnixSeconds {
  static now(): number {
    return Math.floor(Date.now() / 1000);
  }

  static fromNow(seconds: number): number {
    return UnixSeconds.now() + seconds;
  }

  static convertToUnixSeconds(date: Date): number {
    return Math.floor(date.getTime() / 1000);
  }

  static toSeconds({
    hours = 0,
    minutes = 0,
    seconds = 0,
    days = 0,
    weeks = 0,
    months = 0,
    years = 0,
  }: {
    hours?: number;
    minutes?: number;
    seconds?: number;
    days?: number;
    weeks?: number;
    months?: number;
    years?: number;
  }) {
    return (
      seconds +
      minutes * 60 +
      hours * 60 * 60 +
      days * 60 * 60 * 24 +
      weeks * 60 * 60 * 24 * 7 +
      months * 60 * 60 * 24 * 30 +
      years * 60 * 60 * 24 * 365
    );
  }

  static roundToNearest(
    resolution: `${number}${'s' | 'm' | 'h' | 'd' | 'w' | 'M' | 'y'}`,
    unixTimestamp: number,
  ) {
    const secondsPer = {
      s: 1,
      m: 60,
      h: 60 * 60,
      d: 60 * 60 * 24,
      w: 60 * 60 * 24 * 7,
      M: 60 * 60 * 24 * 30,
      y: 60 * 60 * 24 * 365,
    };

    const resolutionSeconds = secondsPer[resolution[resolution.length - 1]];
    const resolutionValue = Number(resolution.slice(0, resolution.length - 1));
    const rounded =
      Math.floor(unixTimestamp / (resolutionSeconds * resolutionValue)) *
      resolutionSeconds *
      resolutionValue;
    return rounded;
  }

  static roundToNearestFiveMinutes(unixTimestamp: number) {
    return UnixSeconds.roundToNearest('5m', unixTimestamp);
  }

  static sameDay(a: number, b: number) {
    return Math.floor(a / (60 * 60 * 24)) === Math.floor(b / (60 * 60 * 24));
  }

  static sameWeek(a: number, b: number) {
    return (
      Math.floor(a / (60 * 60 * 24 * 7)) === Math.floor(b / (60 * 60 * 24 * 7))
    );
  }

  static sameMonth(a: number, b: number) {
    return (
      Math.floor(a / (60 * 60 * 24 * 30)) ===
      Math.floor(b / (60 * 60 * 24 * 30))
    );
  }

  static withinOneMinute(a: number, b: number) {
    return Math.abs(a - b) <= 60;
  }

  static withinOneHour(a: number, b: number) {
    return Math.abs(a - b) <= 60 * 60;
  }

  static withinOneDay(a: number, b: number) {
    return Math.abs(a - b) <= 60 * 60 * 24;
  }

  static withinOneWeek(a: number, b: number) {
    return Math.abs(a - b) <= 60 * 60 * 24 * 7;
  }

  static withinOneMonth(a: number, b: number) {
    return Math.abs(a - b) <= 60 * 60 * 24 * 30;
  }
}
