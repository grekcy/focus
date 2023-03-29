import { Chip } from "@mui/material";
import { SyntheticEvent } from "react";

export const LabelColors: string[] = [
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
];

const LabelTextColors: { [key: string]: string } = {
  "": "black",
};

export function LabelTextColorFor(color: string) {
  return LabelTextColors[color] ? LabelTextColors[color] : "white";
}

interface LabelChipProp {
  id?: string;
  label: string;
  color: string;
  onClick?: (e: SyntheticEvent<HTMLDivElement, MouseEvent>) => void;
}

export function LabelChip({ id, label, color, onClick }: LabelChipProp) {
  return (
    <Chip
      id={id}
      label={label}
      sx={{
        color: LabelTextColorFor(color),
        backgroundColor: color,
      }}
      onClick={(e) => onClick && onClick(e)}
      clickable={!!onClick}
    />
  );
}
