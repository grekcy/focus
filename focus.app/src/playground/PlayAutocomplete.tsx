import Autocomplete, {
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { SxProps, Theme } from "@mui/material/styles";
import update from "immutability-helper";
import { KeyboardEvent, ReactNode, useEffect, useState } from "react";
import { Key } from "ts-key-enum";

function PlayAutocomplete() {
  return (
    <>
      <Stack direction="row">
        <Checkbox checked={true} />
        <MoviesSelect sx={{ width: "300px" }} />
      </Stack>

      <MoviesSelect />

      <WithChip />
    </>
  );
}
export default PlayAutocomplete;

interface MovieSelectProps {
  sx?: SxProps<Theme>;
}

function MoviesSelect({ sx }: MovieSelectProps) {
  const options = [
    { label: "The Godfather", id: 1 },
    { label: "Pulp Fiction", id: 2 },
  ];

  return (
    <Autocomplete
      options={options}
      renderInput={function (params: AutocompleteRenderInputParams): ReactNode {
        return <TextField {...params} label="Movie" />;
      }}
      sx={sx}
    ></Autocomplete>
  );
}

interface LabelOption {
  id: number;

  label: string;
  color: string;
}

function WithChip() {
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
    <>
      <Typography>with chip</Typography>
      <Autocomplete
        autoHighlight
        clearOnBlur
        clearOnEscape
        openOnFocus
        renderInput={function (
          params: AutocompleteRenderInputParams
        ): ReactNode {
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
    </>
  );
}
