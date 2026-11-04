import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'elapsedDate',
})
export class ElapsedDatePipe implements PipeTransform {
  transform(value: Date | string | number): string {
    if (!value) return '';

    const inputDate = new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - inputDate.getTime()) / 1000);

    if (seconds < 0) return 'just now';

    const intervals: { [key: string]: number } = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };

    for (const key in intervals) {
      const counter = Math.floor(seconds / intervals[key]);
      if (counter > 0) {
        if (counter === 1) {
          return `1 ${key} ago`;
        } else {
          return `${counter} ${key}s ago`;
        }
      }
    }

    return 'just now';
  }
}
