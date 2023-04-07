import EventIcon from "@mui/icons-material/Event";
import { Button, Divider, IconButton, Popover, TextField } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { DateCalendar } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useRef, useState } from "react";

interface DatePickButtonProp {
  value?: Dayjs | null;
  onChange?: (value: Dayjs | null) => void;
  sx?: SxProps<Theme>;
}

export function DatePickButton({
  value: inValue,
  sx,
  onChange,
}: DatePickButtonProp) {
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
              size="small"
              onClick={() => {
                setAnchor(ref.current);
                setOpen(true);
              }}
            >
              <EventIcon color="action" fontSize="small" />
            </IconButton>
          ),
        }}
        sx={{ width: { md: 120 }, ...sx }}
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
            onChange && onChange(dayjs());
          }}
        >
          Today
        </Button>
        <Button
          onClick={() => {
            setValue(null);
            setOpen(false);
            onChange && onChange(null);
          }}
        >
          Clear
        </Button>
      </Popover>
    </>
  );
}
