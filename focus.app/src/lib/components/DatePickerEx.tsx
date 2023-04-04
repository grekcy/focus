import EventIcon from "@mui/icons-material/Event";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import { SxProps, Theme } from "@mui/material/styles";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";
import { useRef, useState } from "react";

interface DatePickerExProp {
  value?: Dayjs | null;
  onChange?: (value: Dayjs | null) => void;
  sx?: SxProps<Theme>;
}

export default function DatePickerEx({
  value: inValue,
  sx,
  onChange,
}: DatePickerExProp) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<Element | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(inValue);

  return (
    <>
      <TextField
        ref={ref}
        size="small"
        variant="standard"
        value={value ? value.toDate().toLocaleDateString() : "None"}
        InputProps={{
          disableUnderline: true,
          readOnly: true,
          endAdornment: (
            <IconButton
              onClick={() => {
                setAnchor(ref.current);
                setOpen(true);
              }}
            >
              <EventIcon sx={{ color: "graytext" }} />
            </IconButton>
          ),
        }}
        sx={{ width: { md: 150 }, ...sx }}
      ></TextField>
      <Popover
        open={open}
        anchorEl={anchor}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        onClose={() => setOpen(false)}
      >
        <DateCalendar
          value={value}
          onChange={(value: Dayjs | null) => {
            setValue(value);
            setOpen(false);
            onChange && onChange(value);
          }}
        ></DateCalendar>
        <Divider />
        <Button
          onClick={() => {
            setValue(dayjs());
            setOpen(false);
          }}
        >
          Today
        </Button>
        <Button
          onClick={() => {
            setValue(null);
            setOpen(false);
          }}
        >
          Clear
        </Button>
      </Popover>
    </>
  );
}
