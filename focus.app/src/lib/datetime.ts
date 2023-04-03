import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // import plugin

dayjs.extend(utc);

// function midnight(): Dayjs {}

export namespace datetime {
  export function now() {
    return dayjs();
  }

  export function workTime() {
    return dayjs().set("hour", 9).set("minute", 0).set("second", 0);
  }
}
