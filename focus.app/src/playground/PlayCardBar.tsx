import Button from "@mui/material/Button";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useRef } from "react";
import CardBar, { ICardBar } from "../lib/components/CardBar";

function PlayCardBar() {
  const ref = useRef<ICardBar>(null);

  return (
    <>
      <Button onClick={() => ref.current?.setCardNo(2083)}>Open</Button>
      <Button onClick={() => ref.current?.toggle()}>Toggle</Button>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker />
        <DateTimePicker />
      </LocalizationProvider>
      <CardBar ref={ref} open={true} cardNo={2083} />
    </>
  );
}
export default PlayCardBar;
