import { datetime } from "../lib/datetime";

export function PlayDateTime() {
  return (
    <>
      <ul>
        <li>Now: {datetime.now().toDate().toLocaleString()}</li>
        <li>
          Midnight:
          {datetime
            .now()
            .set("hour", 0)
            .set("minute", 0)
            .set("second", 0)
            .toDate()
            .toLocaleString()}
        </li>
        <li>
          Defer tomorrow:
          {datetime
            .now()
            .set("hour", 9)
            .set("minute", 0)
            .set("second", 0)
            .add(1, "day")
            .toDate()
            .toLocaleString()}
        </li>
      </ul>
    </>
  );
}
