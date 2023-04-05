import { Box, Button } from "@mui/material";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { useRef, useState } from "react";
import { CardBar, ICardBar } from "../lib/components/CardBar";
import { DatePickerEx } from "../lib/components/DatePickerEx";

export function PlayCardBar() {
  const ref = useRef<ICardBar>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Button onClick={() => ref.current?.setCardNo(2083)}>Open</Button>
        <Button onClick={() => ref.current?.toggle()}>Toggle</Button>
        PlayDatePickerEx <PlayDatePickerEx />
      </Box>

      <DatePicker />
      <DateTimePicker />
      <CardBar ref={ref} open={true} cardNo={2083} />
    </LocalizationProvider>
  );
}

function PlayDatePickerEx() {
  const [value, setValue] = useState<Dayjs | null>(null);
  return (
    <>
      <DatePickerEx value={value} onChange={(v: Dayjs | null) => setValue(v)} />
      Selected: {value ? value.toDate().toLocaleString() : "null"}
    </>
  );
}
