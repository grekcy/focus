import { AlertColor } from "@mui/material";
import { createContext } from "react";
import { FocusAPI } from "./lib/api";

export interface IFocusApp {
  // visual
  toggleSidebar: () => void;
  toast: (message: string, severity?: AlertColor) => void;

  client: () => FocusAPI | null;
}

export const FocusContext = createContext<IFocusApp>({
  toggleSidebar() {},
  toast(message: string, severity?: AlertColor) {},
  client() {
    return null;
  },
});
