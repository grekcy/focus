import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc"; // import plugin

dayjs.extend(utc);

// function midnight(): Dayjs {}

export namespace datetime {
  export function now() {
    return dayjs();
  }
}
