import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(duration);
dayjs.extend(relativeTime);

export namespace datetime {
  export function now() {
    return dayjs();
  }

  // start of working time of day
  export function workTime(t?: Dayjs): Dayjs {
    t = t ? t : dayjs();
    return t.startOf('day').add(9, 'hour');
  }

  // end of working time of day
  export function dueTime(t?: Dayjs): Dayjs {
    t = t ? t : dayjs();
    return t.startOf('day').add(18, 'hour');
  }
}
