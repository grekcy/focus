import dayjs from 'dayjs';
import { datetime } from './datetime';

describe('datetime', () => {
  test('workTime', () => {
    const got = datetime.workTime();
    expect(got).toEqual(dayjs().set('hour', 9).set('minute', 0).set('second', 0).set('millisecond', 0));
  });

  test('dueTime', () => {
    const got = datetime.dueTime();
    expect(got).toEqual(dayjs().set('hour', 18).set('minute', 0).set('second', 0).set('millisecond', 0));
  });
});
