import { Box, Button, TextField } from "@mui/material";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ChangeEvent, useRef, useState } from "react";
import { CardBar, ICardBar } from "../lib/components/CardBar";
import { DatePickButton } from "../lib/components/DatePickButton";

export function PlayCardBar() {
  const ref = useRef<ICardBar>(null);

  const [cardNo, setCardNo] = useState<number>(2105);
  function onCardNoChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setCardNo(parseInt(e.currentTarget.value));
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <TextField
          value={cardNo ? cardNo : ""}
          onChange={onCardNoChange}
        ></TextField>
        <Button onClick={() => ref.current?.setCardNo(cardNo)}>Open</Button>
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
  const [value, setValue] = useState<Date | null>(null);
  return (
    <>
      <DatePickButton
        value={value}
        onChange={(v: Date | null) => setValue(v)}
      />
      Selected: {value ? value.toLocaleString() : "null"}
    </>
  );
}
