import { ReactNode, createContext, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AuthContext = createContext<IAuthProvider | null>(null);

export interface IAuthProvider {
  isAuthenticated: () => boolean;
  setToken: (token: string) => void;
  getToken: () => string | null;
}

interface AuthProviderProp {
  children: ReactNode;
}

export class localStorageAuthProvider {
  isAuthenticated = () => !!this.getToken();
  setToken = (token: string | null) => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  };
  getToken = () => localStorage.getItem('token');
}

export function AuthProvider({ children }: AuthProviderProp) {
  const auth = new localStorageAuthProvider();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("Can't find AuthProvider");
  }
  return ctx;
}

interface RequireAuthProps {
  children?: ReactNode;
  require?: 'auth' | 'admin';
}

export function RequireAuth({ children }: RequireAuthProps) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated()) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
