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

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (e) {
    return null;
  }
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('userToken'));
  const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
    const storedToken = localStorage.getItem('userToken');
    if (storedToken) {
      const decoded = parseJwt(storedToken);
      if (decoded) {
        const role = decoded.role || decoded.roles?.[0];
        const newUserInfo = {
          sub: decoded.userId || decoded.sub || decoded.nameid,
          name: decoded.userName || decoded.given_name || decoded.name,
          role: role,
          tenantId: decoded.tenantId || decoded.TenantId,
          isAdmin: hasAdminPrivileges(role)
        };
        return newUserInfo;
      }
    }
    return null;
  });

  const hasAdminPrivileges = (role: string | undefined) => {
    return role === 'admin' || role === 'systemadmin';
  };

  const login = (newToken: string) => {
    const decoded = parseJwt(newToken);
    if (decoded) {
      const role = decoded.role || decoded.roles?.[0];
      const newUserInfo = {
        sub: decoded.userId || decoded.sub || decoded.nameid,
        name: decoded.userName || decoded.given_name || decoded.name,
        role: role,
        tenantId: decoded.tenantId || decoded.TenantId,
        isAdmin: hasAdminPrivileges(role)
      };
      console.log('Setting user info:', newUserInfo);
      setUserInfo(newUserInfo);
      setToken(newToken);
      localStorage.setItem('userToken', newToken);
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('refreshToken');
    setUserInfo(null);
    setToken(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ userInfo, token, login, logout }}>
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