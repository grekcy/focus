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
import { arrayContentEquals } from "../lib";
import { LabelChip } from "./LabelChip";

export interface LabelOption {
  id: number;
  label: string;
  color: string;
}

interface LabelSelectorProps {
  labels: LabelOption[];
  selected?: number[]; // id of labels
  sx?: SxProps<Theme>;
  onSelectionChange?: (selected: number[]) => void; // id of labels
}

interface ILabelSelector {}

export const LabelSelector = forwardRef(
  (
    {
      labels,
      selected: inSelected = [],
      sx,
      onSelectionChange,
    }: LabelSelectorProps,
    ref: Ref<HTMLDivElement>
  ) => {
    const [options, setOptions] = useState<LabelOption[]>(labels);
    const [selected, setSelected] = useState<number[]>(inSelected);
    const [value, setValue] = useState("");

    useEffect(() => {
      if (!arrayContentEquals(selected, inSelected)) setSelected(inSelected);
    }, [inSelected]);

    useEffect(() => {
      setOptions(
        labels.filter((o) => selected.findIndex((s) => s === o.id) === -1)
      );
    }, [labels, selected]);

    function deleteLabel(id: number) {
      const index = selected.indexOf(id);
      const updated = update(selected, { $splice: [[index, 1]] });
      setSelected(updated);
      onSelectionChange && onSelectionChange(updated);
    }

    function handleChange(
      e: SyntheticEvent<Element, Event>,
      newValue: LabelOption | null
    ) {
      if (!newValue) return;

      const updated = update(selected, { $push: [newValue.id] });
      setSelected(updated);

      setValue("");

      onSelectionChange && onSelectionChange(updated);
    }

    return (
      <Autocomplete
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
          params.InputProps.startAdornment = selected.map((id) => {
            const label = labels.find((e) => e.id === id);
            if (!label) return <></>;
            return (
              <LabelChip
                key={label.id}
                label={label.label}
                color={label.color}
                onDelete={() => deleteLabel(id)}
              />
            );
          });

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
