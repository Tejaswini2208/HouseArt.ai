import React from 'react';

export interface LocalUser {
  username: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  user: LocalUser | null;
  loading: boolean;
  signIn: (details: LocalUser) => void;
  logout: () => void;
  showLogin: boolean;
  setShowLogin: (show: boolean) => void;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<LocalUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [showLogin, setShowLogin] = React.useState(false);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('houseart_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user', e);
      }
    }
    setLoading(false);
  }, []);

  const signIn = (details: LocalUser) => {
    setUser(details);
    localStorage.setItem('houseart_user', JSON.stringify(details));
    setShowLogin(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('houseart_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, logout, showLogin, setShowLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
