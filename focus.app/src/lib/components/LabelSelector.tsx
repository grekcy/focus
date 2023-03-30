import { Theme } from "@emotion/react";
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  SxProps,
  TextField,
} from "@mui/material";
import update from "immutability-helper";
import {
  KeyboardEvent,
  ReactNode,
  Ref,
  SyntheticEvent,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { Key } from "ts-key-enum";
import { LabelChip } from "./LabelChip";

export interface LabelOption {
  id: number;
  label: string;
  color: string;
}

interface LabelSelectorProps {
  labels: LabelOption[];
  selection?: number[]; // id of labels
  sx?: SxProps<Theme>;
  onChange?: (selection: LabelOption[]) => void;
}

interface ILabelSelector {}

export const LabelSelector = forwardRef(
  (
    { labels, selection = [], sx, onChange }: LabelSelectorProps,
    ref: Ref<HTMLDivElement>
  ) => {
    const [options, setOptions] = useState<LabelOption[]>(labels);
    const [selected, setSelected] = useState<LabelOption[]>(
      selection
        .filter((x) => labels.findIndex((label) => label.id === x) !== -1)
        .map((x) => labels.find((label) => label.id === x)!)
    );
    const [value, setValue] = useState("");

    useEffect(() => {
      setOptions(
        labels.filter((o) => selected.findIndex((s) => s.id === o.id) === -1)
      );
    }, [labels, selected]);

    function deleteLabel(index: number) {
      const updated = update(selected, { $splice: [[index, 1]] });
      setSelected(updated);
      onChange && onChange(updated);
    }

    function handleChange(
      e: SyntheticEvent<Element, Event>,
      newValue: LabelOption | null
    ) {
      if (!newValue) return;

      const updated = update(selected, { $push: [newValue] });
      setSelected(updated);

      setValue("");

      onChange && onChange(updated);
    }

    return (
      <Autocomplete
        // ref={ref}
        size="small"
        sx={sx}
        autoHighlight
        clearOnBlur
        clearOnEscape
        openOnFocus
        renderInput={function (
          params: AutocompleteRenderInputParams
        ): ReactNode {
          params.size = "small";
          params.inputProps.value = value;
          params.InputProps.startAdornment = selected.map((label, i) => (
            <LabelChip
              key={label.id.toString()}
              label={label.label}
              color={label.color}
              onDelete={() => deleteLabel(i)}
            />
          ));

          return <TextField {...params} inputRef={ref} />;
        }}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            <LabelChip
              key={option.id}
              id={option.id}
              label={option.label}
              color={option.color}
            />
          </Box>
        )}
        options={options}
        isOptionEqualToValue={(option: LabelOption, value: LabelOption) =>
          option.id === value.id
        }
        onChange={handleChange}
        onInputChange={(e: any, value: string) => setValue(value)}
        onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
          if (e.key === Key.Backspace && value === "" && selected.length > 0)
            deleteLabel(selected.length - 1);
        }}
      />
    );
  }
);
