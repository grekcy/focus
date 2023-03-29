import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  Chip,
  TextField,
  Typography,
} from "@mui/material";
import update from "immutability-helper";
import { KeyboardEvent, ReactNode, useEffect, useState } from "react";
import { Key } from "ts-key-enum";


export function PlayLabel() {
  return (
    <>
      <Typography>Label selector</Typography>
      <LabelSelector />
    </>
  );
}

interface LabelOption {
    id: number;
    label: string;
    color: string;
  }
  
function LabelSelector() {
  const initialOptions: LabelOption[] = [
    { id: 1, label: "bug", color: "primary" },
    { id: 2, label: "enhancement", color: "secondary" },
    { id: 3, label: "important", color: "info" },
    { id: 4, label: "urgent", color: "error" },
    { id: 5, label: "focus", color: "warning" },
    { id: 6, label: "grekcy", color: "success" },
  ];
  const [options, setOptions] = useState<LabelOption[]>(initialOptions);
  const [selected, setSelected] = useState<LabelOption[]>([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    setOptions(
      initialOptions.filter(
        (o) => selected.findIndex((s) => s.id === o.id) === -1
      )
    );
  }, [selected]);

  function deleteLabel(index: number) {
    setSelected((p) => update(p, { $splice: [[index, 1]] }));
  }

  return (
    <Autocomplete
      autoHighlight
      clearOnBlur
      clearOnEscape
      openOnFocus
      renderInput={function (params: AutocompleteRenderInputParams): ReactNode {
        params.inputProps.value = value;
        params.InputProps.startAdornment = selected.map((label, i) => (
          <Chip
            label={label.label}
            sx={{ backgroundColor: label.color }}
            onDelete={() => deleteLabel(i)}
          />
        ));

        return <TextField {...params} />;
      }}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Chip label={option.label} />
        </Box>
      )}
      options={options}
      onChange={(e: any, newValue: LabelOption | null) => {
        if (!newValue) return;
        setSelected((p) => update(p, { $push: [newValue] }));
        setValue("");
      }}
      onInputChange={(e: any, value: string) => setValue(value)}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === Key.Backspace && value === "" && selected.length > 0)
          deleteLabel(selected.length - 1);
      }}
    />
  );
}
