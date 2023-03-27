import { AlertColor } from "@mui/material";
import { ReactNode, createContext, useContext } from "react";
import { Cookies } from "react-cookie";
import { FocusAPI } from "./lib/api";

export interface IFocusApp {
  // visual
  toggleSidebar: () => void;
  toast: (message: string, severity?: AlertColor) => void;
}

const FocusContext = createContext<IFocusApp>({
  toggleSidebar() {},
  toast(message: string, severity?: AlertColor) {},
});

interface FocusProviderProp {
  app: IFocusApp;
  children: ReactNode;
}

export function FocusProvider({ app, children }: FocusProviderProp) {
  return <FocusContext.Provider value={app}>{children}</FocusContext.Provider>;
}

export function useFocusApp() {
  const state = useContext(FocusContext);
  if (!state) {
    throw new Error("Cannot find FocusProvider");
  }

  return state;
}

const FocusClientContext = createContext<FocusAPI | null>(null);

interface FocusClientProviderProps {
  children: ReactNode;
}

// TODO get token from cookie
const cookies = new Cookies();

export function FocusClientProvider({ children }: FocusClientProviderProps) {
  const api = new FocusAPI("http://localhost:8080", () => "whitekid@gmail.com");

  return (
    <FocusClientContext.Provider value={api}>
      {children}
    </FocusClientContext.Provider>
  );
}

export function useFocusClient() {
  const state = useContext(FocusClientContext);
  if (!state) {
    throw new Error("Cannot find FocusClientProvider");
  }
  return state;
}
