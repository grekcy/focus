import { AlertColor as muiAlertColor } from "@mui/material";
import {
  ReactNode,
  Ref,
  createContext,
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";
import { Cookies } from "react-cookie";
import { FocusAPI } from "./lib/api";
import { IToast, Toast } from "./lib/components/Toast";

export type AlertColor = muiAlertColor;

export interface IFocusApp {
  // visual
  toggleSidebar: () => void;
  toast: (message: string, severity?: AlertColor) => void;
}

const FocusContext = createContext<IFocusApp | null>(null);

interface FocusProviderProp {
  app: IFocusApp;
  children: ReactNode;
}

export interface IFocusProvider {
  toast: (message: string, severity?: AlertColor) => void;
}

export const FocusProvider = forwardRef(
  ({ app, children }: FocusProviderProp, ref: Ref<IFocusProvider>) => {
    useImperativeHandle(ref, () => ({
      toast(message: string, severity?: AlertColor) {
        toastRef.current && toastRef.current.toast(message, severity);
      },
    }));

    const toastRef = useRef<IToast>(null);

    return (
      <FocusContext.Provider value={app}>
        {children}
        <Toast ref={toastRef} />
      </FocusContext.Provider>
    );
  }
);

export function useFocusApp() {
  const ctx = useContext(FocusContext);
  if (!ctx) {
    throw new Error("Can not find FocusProvider");
  }

  return ctx;
}

const FocusClientContext = createContext<FocusAPI | null>(null);

interface FocusClientProviderProps {
  children: ReactNode;
}

interface IFocusClientProvider {}

// TODO get token from cookie
const cookies = new Cookies();

export const FocusClientProvider = forwardRef(
  ({ children }: FocusClientProviderProps, ref: Ref<IFocusClientProvider>) => {
    const api = new FocusAPI(
      "http://localhost:8080",
      () => "whitekid@gmail.com" // FIXME
    );

    useImperativeHandle(ref, () => ({}));

    return (
      <FocusClientContext.Provider value={api}>
        {children}
      </FocusClientContext.Provider>
    );
  }
);

export function useFocusClient() {
  const ctx = useContext(FocusClientContext);
  if (!ctx) {
    throw new Error("Cannot find FocusClientProvider");
  }
  return ctx;
}
