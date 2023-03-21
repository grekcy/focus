import { TextField } from "@mui/material";
import {
  ChangeEvent,
  FocusEvent,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";

interface InlineEditProp {
  value?: string;
  onSubmit?: (target: Element, value: string) => void;
}

// Ref: https://www.emgoto.com/react-inline-edit/
export function InlineEdit({ value = "", onSubmit }: InlineEditProp) {
  const [prevValue, setPrevValue] = useState(value);
  const [editingValue, setEditingValue] = useState(value);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setPrevValue(editingValue);
  }, [editing]);

  function handleClick() {
    if (!editing) setEditing(true);
  }

  function handleBlur(e: FocusEvent) {
    setEditing(false);
    if (prevValue !== editingValue && onSubmit) {
      onSubmit(e.currentTarget, editingValue);
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setEditingValue(e.currentTarget.value);
  }

  function handleKeyDownM(e: SyntheticEvent<HTMLDivElement, KeyboardEvent>) {
    if (e.nativeEvent.key === "Enter" || e.nativeEvent.key === "Escape") {
      if (e.nativeEvent.key === "Escape") setEditingValue(prevValue);
      (e.nativeEvent.target! as HTMLInputElement).blur();
    }
  }

  return (
    <TextField
      size="small"
      variant="standard"
      value={editingValue}
      onChange={handleChange}
      onClick={handleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDownM}
      InputProps={{ disableUnderline: !editing, readOnly: !editing }}
      fullWidth
    />
  );
}
