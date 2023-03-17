import { AlertColor } from "@mui/material";
import { createContext } from "react";
import { v1alpha1Client } from "./lib/proto/FocusServiceClientPb";

export interface IFocusApp {
  // visual
  toggleSidebar: () => void;
  toast: (message: string, severity?: AlertColor) => void;

  client: () => v1alpha1Client | void;
}

export const FocusContext = createContext<IFocusApp>({
  toggleSidebar() {},
  toast(message: string, severity?: AlertColor) {},
  client() {},
});
