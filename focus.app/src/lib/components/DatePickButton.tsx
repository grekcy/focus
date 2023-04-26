import { Button, Divider, Popover } from '@mui/material';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useRef, useState } from 'react';

interface DatePickButtonProp {
  value?: Date | null;
  emptyText?: string;
  onChange?: (value: Date | null) => void;
}

export function DatePickButton({ value: inValue = null, emptyText = 'None', onChange }: DatePickButtonProp) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<Element | null>(null);
  const ref = useRef<HTMLButtonElement>(null);
  const [value, setValue] = useState<Dayjs | null>(inValue ? dayjs(inValue) : null);

  function onValueChange(value: Dayjs | null) {
    setValue(value);
    setOpen(false);
    onChange && onChange(value ? value.set('hour', 0).set('minute', 0).set('second', 0).toDate() : null);
  }

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Button
          ref={ref}
          onClick={() => {
            setAnchor(ref.current);
            setOpen(true);
          }}
        >
          {value ? value.toDate().toLocaleDateString() : emptyText}
        </Button>
        <Popover
          open={open}
          anchorEl={anchor}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          onClose={() => setOpen(false)}
        >
          <DateCalendar value={value} onChange={onValueChange}></DateCalendar>
          <Divider />
          <Button onClick={() => onValueChange(dayjs())}>Today</Button>
          <Button onClick={() => onValueChange(null)}>Clear</Button>
        </Popover>
      </LocalizationProvider>
    </>
  );
}
