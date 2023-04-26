import { AlertColor as muiAlertColor } from '@mui/material';
import { ReactNode, Ref, createContext, forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { FocusAPI } from '../api';
import { AuthProvider, useAuth } from './AuthProvider';
import { IToast, Toast } from './Toast';

export type AlertColor = muiAlertColor;

export interface IFocusApp {
  // visual
  toggleSidebar: () => void;
  toast: (message: string, severity?: AlertColor) => void;
}

const FocusContext = createContext<IFocusApp | null>(null);

interface FocusProviderProp {
  children: ReactNode;
  onToggleSideBar?: () => void;
}

interface IFocusProvider {}

export const FocusProvider = forwardRef(
  ({ children, onToggleSideBar }: FocusProviderProp, ref: Ref<IFocusProvider>) => {
    const app: IFocusApp = {
      toggleSidebar() {
        onToggleSideBar && onToggleSideBar();
      },
      toast(message: string, severity?: AlertColor) {
        toastRef.current && toastRef.current.toast(message, severity);
      },
    };

    useImperativeHandle(ref, () => ({}));

    const toastRef = useRef<IToast>(null);

    return (
      <FocusContext.Provider value={app}>
        <AuthProvider>
          <FocusClientProvider>{children}</FocusClientProvider>
        </AuthProvider>
        <Toast ref={toastRef} />
      </FocusContext.Provider>
    );
  }
);

export function useFocusApp() {
  const focusApp = useContext(FocusContext);
  if (!focusApp) {
    throw new Error('Can not find FocusProvider');
  }

  return focusApp;
}

// shortcut for useFocusApp(), useFocusClient(), useAuth()
export function useFocus(): [IFocusApp, FocusAPI] {
  return [useFocusApp(), useFocusClient()];
}

const FocusClientContext = createContext<FocusAPI | null>(null);

interface FocusClientProviderProps {
  children: ReactNode;
}

interface IFocusClientProvider {}

const FocusClientProvider = forwardRef(({ children }: FocusClientProviderProps, ref: Ref<IFocusClientProvider>) => {
  const api = new FocusAPI(process.env.REACT_APP_API_ENDPOINT!, useAuth());

  useImperativeHandle(ref, () => ({
    client() {
      return api;
    },
  }));

  return <FocusClientContext.Provider value={api}>{children}</FocusClientContext.Provider>;
});

export function useFocusClient(): FocusAPI {
  const ctx = useContext(FocusClientContext);
  if (!ctx) {
    throw new Error('Cannot find FocusClientProvider');
  }
  return ctx;
}
