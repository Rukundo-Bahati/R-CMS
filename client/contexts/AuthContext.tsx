import { createContext, useContext, useState, ReactNode } from "react";

export type Portal =
  | "president"
  | "grand_pere_mere"
  | "accountant"
  | "family"
  | "choir"
  | "intercessors"
  | "ushers"
  | "pastor";

interface User {
  id: string;
  name: string;
  email: string;
  portal: Portal;
}

interface AuthContextType {
  user: User | null;
  portal: Portal | null;
  login: (user: User) => void;
  logout: () => void;
  selectPortal: (portal: Portal) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("church_user");
      if (saved) {
        return JSON.parse(saved);
      }

      // Auto-login for demo if visiting a protected route
      const pathname = window.location.pathname;
      if (pathname.startsWith("/dashboard/")) {
        const portalMatch = pathname.match(/\/dashboard\/([^/]+)/);
        if (portalMatch) {
          const portal = portalMatch[1] as Portal;
          const demoUser = {
            id: "1",
            name: "Church Administrator",
            email: "admin@church.com",
            portal,
          };
          return demoUser;
        }
      }
    }
    return null;
  });

  const login = (userData: User) => {
    setUser(userData);
    if (typeof window !== "undefined") {
      localStorage.setItem("church_user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("church_user");
    }
  };

  const selectPortal = (portal: Portal) => {
    if (user) {
      const updatedUser = { ...user, portal };
      setUser(updatedUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("church_user", JSON.stringify(updatedUser));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, portal: user?.portal ?? null, login, logout, selectPortal }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
