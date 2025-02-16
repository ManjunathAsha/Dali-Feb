import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';

import ColorModeContext from "./context/ColorModeContext";
import { UserProvider, useUser } from './context/AuthContext';
import { createCustomTheme } from "./context/CustomTheme";
import LoginPage from "./components/Authentication/LoginPage";
import Dashboard from "./components/pages/Dashboard";
import Handbook from "./components/pages/Handbook/Handbook";
import WelcomePage from "./components/pages/WelcomePage";
import { SidebarProvider } from "./context/SidebarContext";
import { ThemeProvider, Box, styled } from "@mui/material";
import { ROUTES } from './constants/routes';
import { ARIA_LABELS } from './constants/aria';
import { STYLING } from './constants/styling';
import { COLORS } from './constants/colors';
import { LoadingProvider } from "./context/LoadingContext";
import './scss/Loading.scss';  // Add this line to import loading styles
import NewUser from "./components/pages/UserCreation/NewUser";
import UsersByRole from "./components/pages/UserCreation/UsersByRole";
import UserOverview from "./components/pages/UserCreation/UserOverviews";
import LastLoggedIn from "./components/pages/UserCreation/LastLogin";
import NewRequirement from "./components/pages/chapter-management/NewRequirement";
import ForwardedChangeRequests from "./components/pages/chapter-management/ForwardedChangeRequest";
import ChangeRequest from "./components/pages/chapter-management/ChangeRequest";
import ExternalMaps from "./components/pages/ExtenalMap/ExternalMap";

const SkipLink = styled('a')(({ theme }) => ({
  position: 'absolute',
  left: '-9999px',
  top: 'auto',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  '&:focus': {
    position: 'fixed',
    top: '0',
    left: '0',
    width: 'auto',
    height: 'auto',
    padding: '16px',
    background: COLORS.base.white,
    zIndex: STYLING.Z_INDEX.MODAL,
    color: COLORS.base.black,
    textDecoration: 'none',
    fontWeight: 'bold',
    outline: `2px solid ${COLORS.base.black}`,
  }
}));

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(() => createCustomTheme(mode), [mode]);

  console.log('App rendering...');

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <UserProvider>
          <LoadingProvider>
            <SidebarProvider>
              <Router>
                <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                  <SkipLink href="#main-content" aria-label={ARIA_LABELS.NAVIGATION.SKIP_LINK}>
                    Skip to main content
                  </SkipLink>
                  <Routes>
                    <Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />
                    <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.AUTH.LOGIN} replace />} />
                    <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute component={Dashboard} />} />
                    <Route path={ROUTES.HANDBOOK.ROOT} element={<ProtectedRoute component={Handbook} />} />
                    <Route path={ROUTES.HANDBOOK.WELCOME} element={<ProtectedRoute component={WelcomePage} />} />
                    <Route path={ROUTES.USERCREATION.NEWUSER} element={<ProtectedRoute component={NewUser} />} />
                    <Route path={ROUTES.USERCREATION.USERBYROLES} element={<ProtectedRoute component={UsersByRole} />} />
                    <Route path={ROUTES.USERCREATION.ROOT} element={<ProtectedRoute component={UserOverview} />} />
                    <Route path={ROUTES.USERCREATION.LASTLOGGIN} element={<ProtectedRoute component={LastLoggedIn} />} />
                    <Route path={'/NewRequirement'} element={<ProtectedRoute component={NewRequirement} />} />
                    <Route path={'/ForwardedChangeRequests'} element={<ProtectedRoute component={ForwardedChangeRequests} />} />
                    <Route path={'/ChangeRequest'} element={<ProtectedRoute component={ChangeRequest} />} />
                    <Route path={ROUTES.EXTERNALMAPS.ROOT} element={<ProtectedRoute component={ExternalMaps} />} />
                  </Routes>
                </Box>
              </Router>
            </SidebarProvider>
          </LoadingProvider>
        </UserProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

const ProtectedRoute: React.FC<{ component: React.ComponentType<any> }> = ({ component: Component }) => {
  const { userInfo } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(true);
  
  if (!userInfo) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  // For NewUser component, provide the required props
  if (Component === NewUser) {
    return (
      <Component 
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        toggleSidebar={(open: boolean) => () => {}}
      />
    );
  }
  
  return <Component />;
};

export default App;