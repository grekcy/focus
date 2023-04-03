import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function PlayDateTimePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        disablePast
        defaultValue={dayjs(new Date())}
        onChange={(v) => alert(v)}
      />
    </LocalizationProvider>
  );
}
export default PlayDateTimePicker;
