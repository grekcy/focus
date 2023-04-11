import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(localizedFormat);

// function midnight(): Dayjs {}

export namespace datetime {
  export function now() {
    return dayjs();
  }

  export function workTime() {
    return dayjs().set("hour", 9).set("minute", 0).set("second", 0);
  }
}
