import { Chip } from '@mui/material';
import { SyntheticEvent } from 'react';

export const LabelColors: string[] = [
  // mui theme colors
  'primary.light',
  'primary.main',
  'primary.dark',
  'secondary.light',
  'secondary.main',
  'secondary.dark',
  'error.light',
  'error.main',
  'error.dark',
  'warning.light',
  'warning.main',
  'warning.dark',
  'info.light',
  'info.main',
  'info.dark',
  'success.light',
  'success.main',
  'success.dark',

  // other pre-defined colors: adaped from github
  '#B60205',
  '#D93F0B',
  '#FBCA04',
  '#0E8A16',
  '#006B75',
  '#1D76DB',
  '#0052CC',
  '#5319E7',
  '#E99695',
  '#F9D0C4',
  '#FEF2C0',
  '#C2E0C6',
  '#BFDADC',
  '#C5DEF5',
  '#BFD4F2',
  '#D4C5F9',

  // others
  '#FFFFFF',
  '#000000',
];

const LabelTextColors: { [key: string]: string } = {
  '': '#000000',
  '#FFFFFF': '#000000',
  '#000000': '#FFFFFF',
  '#BFD4F2': '#000000',
  '#FEF2C0': '#000000',
};

export function LabelTextColorFor(color: string) {
  return LabelTextColors[color] ? LabelTextColors[color] : 'white';
}

interface LabelChipProp {
  id?: number;
  label: string;
  color: string;
  size?: 'small' | 'medium';
  onClick?: (e: SyntheticEvent<HTMLDivElement, MouseEvent>) => void;
  onDelete?: (e: SyntheticEvent<HTMLDivElement, MouseEvent>) => void;
}

export function LabelChip({ id, label, color, size, onClick, onDelete }: LabelChipProp) {
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
      size={size}
      {...params}
    />
  );
}
