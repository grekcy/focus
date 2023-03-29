import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  Chip,
  TextField,
} from "@mui/material";
import update from "immutability-helper";
import {
  KeyboardEvent,
  ReactNode,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { Key } from "ts-key-enum";

export const LabelColors: string[] = [
  // mui theme colors
  "primary.light",
  "primary.main",
  "primary.dark",
  "secondary.light",
  "secondary.main",
  "secondary.dark",
  "error.light",
  "error.main",
  "error.dark",
  "warning.light",
  "warning.main",
  "warning.dark",
  "info.light",
  "info.main",
  "info.dark",
  "success.light",
  "success.main",
  "success.dark",
  // other pre-defined colors: adaped from github
  "#B60205",
  "#D93F0B",
  "#FBCA04",
  "#0E8A16",
  "#006B75",
  "#1D76DB",
  "#0052CC",
  "#5319E7",
  "#E99695",
  "#F9D0C4",
  "#FEF2C0",
  "#C2E0C6",
  "#BFDADC",
  "#C5DEF5",
  "#BFD4F2",
  "#D4C5F9",
  // others
  "#FFFFFF",
  "#000000",
];

const LabelTextColors: { [key: string]: string } = {
  "": "#000000",
  "#FFFFFF": "#000000",
  "#000000": "#FFFFFF",
};

export function LabelTextColorFor(color: string) {
  return LabelTextColors[color] ? LabelTextColors[color] : "white";
}

interface LabelChipProp {
  id?: string;
  label: string;
  color: string;
  onClick?: (e: SyntheticEvent<HTMLDivElement, MouseEvent>) => void;
  onDelete?: (e: SyntheticEvent<HTMLDivElement, MouseEvent>) => void;
}

export function LabelChip({
  id,
  label,
  color,
  onClick,
  onDelete,
}: LabelChipProp) {
  const params: any = {};
  if (onDelete) params.onDelete = onDelete;

  return (
    <Chip
      id={id}
      label={label}
      sx={{
        color: LabelTextColorFor(color),
        backgroundColor: color,
      }}
      onClick={(e: any) => onClick && onClick(e)}
      clickable={!!onClick}
      variant="outlined"
      // size="small"
      {...params}
    />
  );
}

interface LabelOption {
  id: number;
  label: string;
  color: string;
}

interface LabelSelectorProps {
  labels: LabelOption[];
}

export function LabelSelector({ labels }: LabelSelectorProps) {
  const [options, setOptions] = useState<LabelOption[]>(labels);
  const [selected, setSelected] = useState<LabelOption[]>([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    const x = labels.filter(
      (o) => selected.findIndex((s) => s.id === o.id) === -1
    );

    setOptions(
      labels.filter((o) => selected.findIndex((s) => s.id === o.id) === -1)
    );
  }, [labels, selected]);

  function deleteLabel(index: number) {
    setSelected((p) => update(p, { $splice: [[index, 1]] }));
  }

  return (
    <Autocomplete
      size="small"
      autoHighlight
      clearOnBlur
      clearOnEscape
      openOnFocus
      renderInput={function (params: AutocompleteRenderInputParams): ReactNode {
        params.inputProps.value = value;
        params.InputProps.startAdornment = selected.map((label, i) => (
          <LabelChip
            label={label.label}
            color={label.color}
            onDelete={() => deleteLabel(i)}
          />
        ));

        return <TextField {...params} />;
      }}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <LabelChip label={option.label} color={option.color} />
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
