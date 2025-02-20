import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserInfo {
  sub: string;
  name: string;
  role: string;
  tenantId: string;
  isAdmin: boolean;
}

interface AuthContextType {
  userInfo: UserInfo | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Helper functions defined outside of component
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (e) {
    return null;
  }
};

const hasAdminPrivileges = (role: string | undefined) => {
  if (!role) return false;
  return role.toLowerCase() === 'admin' || role.toLowerCase().includes('admin');
};

const createUserInfo = (decoded: any): UserInfo | null => {
  if (!decoded) return null;
  const role = decoded.role || decoded.roles?.[0];
  return {
    sub: decoded.userId || decoded.sub || decoded.nameid,
    name: decoded.userName || decoded.given_name || decoded.name,
    role: role,
    tenantId: decoded.tenantId || decoded.TenantId,
    isAdmin: hasAdminPrivileges(role)
  };
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with stored token
  const [token, setToken] = useState<string | null>(localStorage.getItem('userToken'));
  
  // Initialize userInfo based on stored token
  const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
    const storedToken = localStorage.getItem('userToken');
    return storedToken ? createUserInfo(parseJwt(storedToken)) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('userToken', token);
      const decoded = parseJwt(token);
      setUserInfo(createUserInfo(decoded));
    } else {
      localStorage.removeItem('userToken');
      setUserInfo(null);
    }
  }, [token]);

  const login = (newToken: string) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  const value = {
    userInfo,
    token,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};