import { useHotkeys } from "react-hotkeys-hook";
import { Keys, OptionsOrDependencyArray } from "react-hotkeys-hook/dist/types";

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

export function useAction(act: Action) {
  let hotkey = act.hotkey;

  if (hotkey) {
    if (typeof hotkey === "string") hotkey = repl(hotkey as string);
    else if (
      Array.isArray(hotkey) &&
      hotkey.every((e) => typeof e === "string")
    )
      hotkey = hotkey.map((c) => repl(c));
  }

  useHotkeys(
    hotkey ? hotkey : "",
    () => {
      if (act.onEnabled && !act.onEnabled()) return;
      act.onExecute && act.onExecute();
    },
    act.hotkeyOptions
  );
  return act;
}
