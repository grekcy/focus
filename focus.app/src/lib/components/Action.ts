import { MutableRefObject } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
  Keys,
  OptionsOrDependencyArray,
  RefType,
} from "react-hotkeys-hook/dist/types";

export const actDivider = { label: "-" };

export interface Action {
  label: string;
  icon?: JSX.Element;
  hotkey?: Keys;
  hotkeyOptions?: OptionsOrDependencyArray;
  onEnabled?: () => boolean;
  onExecute?: () => void;
}

function repl(s: string): string {
  return s.replace("⌘", "meta");
}

export function useAction(
  act: Action
): [Action, MutableRefObject<RefType<HTMLElement>>] {
  return [act, _useAction(act)];
}

function _useAction(act: Action): MutableRefObject<RefType<HTMLElement>> {
  let hotkey = act.hotkey;

  if (hotkey) {
    if (typeof hotkey === "string") hotkey = repl(hotkey as string);
    else if (
      Array.isArray(hotkey) &&
      hotkey.every((e) => typeof e === "string")
    )
      hotkey = hotkey.map((c) => repl(c));
  }

  const ref = useHotkeys(
    hotkey ? hotkey : "",
    () => {
      if (act.onEnabled && !act.onEnabled()) return;
      act.onExecute && act.onExecute();
    },
    act.hotkeyOptions
  );

  return ref;
}
