import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import { useRef, useState } from "react";
import CardBar, { ICardBar } from "../lib/components/CardBar";
import DatePickerEx from "../lib/components/DatePickerEx";

function PlayCardBar() {
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
export default PlayCardBar;

function PlayDatePickerEx() {
  const [value, setValue] = useState<Dayjs | null>(null);
  return (
    <>
      <DatePickerEx value={value} onChange={(v: Dayjs | null) => setValue(v)} />
      Selected: {value ? value.toDate().toLocaleString() : "null"}
    </>
  );
}
