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
  multiline?: boolean;
  onSubmit?: (target: Element, value: string) => void;
}

// Ref: https://www.emgoto.com/react-inline-edit/
export function InlineEdit({
  value = "",
  multiline = false,
  onSubmit,
}: InlineEditProp) {
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
    switch (e.nativeEvent.key) {
      case "Enter":
        if (multiline) return;
        (e.nativeEvent.target! as HTMLInputElement).blur();
        break;
      case "Escape":
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
      multiline={multiline}
    />
  );
}
