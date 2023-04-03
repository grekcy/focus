import TextField from "@mui/material/TextField";
import {
  ChangeEvent,
  FocusEvent,
  Ref,
  SyntheticEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

interface InlineEditProp {
  value?: string;
  multiline?: boolean;
  endAdornment?: React.ReactNode;
  onSubmit?: (target: Element, value: string) => void;
}

export interface IInlineEdit {
  edit: () => void;
  scrollIntoView: (options?: ScrollIntoViewOptions) => void;
}

// Ref: https://www.emgoto.com/react-inline-edit/
const InlineEdit = forwardRef(
  (
    { value = "", multiline = false, endAdornment, onSubmit }: InlineEditProp,
    ref: Ref<IInlineEdit>
  ) => {
    useImperativeHandle(ref, () => ({
      edit() {
        if (!inputRef.current) return;
        setEditing(true);
        inputRef.current.focus();
      },
      scrollIntoView(options?: ScrollIntoViewOptions) {
        textFieldRef.current && textFieldRef.current.scrollIntoView(options);
      },
    }));

    const inputRef = useRef<HTMLInputElement>(null);
    const textFieldRef = useRef<HTMLDivElement>(null);

    const [prevValue, setPrevValue] = useState(value);
    const [editingValue, setEditingValue] = useState(value);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
      setEditingValue(value);
    }, [value]);

    useEffect(() => {
      if (editing) {
        setPrevValue(editingValue);
      }
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

    function handleKeyDown(e: SyntheticEvent<HTMLDivElement, KeyboardEvent>) {
      switch (e.nativeEvent.key) {
        case "Enter":
          if (multiline) return;
          setTimeout(() => {
            (e.nativeEvent.target! as HTMLInputElement).blur();
          }, 0);
          break;
        case "Escape":
          setEditingValue(prevValue);
          setTimeout(() => {
            (e.nativeEvent.target! as HTMLInputElement).blur();
          }, 0);
          break;
      }
    }

    return (
      <TextField
        ref={textFieldRef}
        inputRef={inputRef}
        size="small"
        variant="standard"
        value={editingValue}
        onChange={handleChange}
        onClick={handleClick}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        InputProps={{
          disableUnderline: !editing,
          readOnly: !editing,
          endAdornment: endAdornment,
        }}
        fullWidth
        multiline={multiline}
        focused={true}
      />
    );
  }
);
export default InlineEdit;
