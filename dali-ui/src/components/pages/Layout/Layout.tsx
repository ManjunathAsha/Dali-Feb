import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../Sidebar';
import CustomAppBar from './CustomAppBar';
import { getSidebarConfig } from '../../../data/sidebarItemsConfig';
import { useSidebar } from '../../../context/SidebarContext';
import { useUser } from '../../../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const SIDEBAR_WIDTH = 300;
const DRAWER_WIDTH = 400;
const APPBAR_HEIGHT = 64;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isSidebarOpen, toggleSidebar, state } = useSidebar();
  const { userInfo } = useUser();
  const userRole = userInfo?.role || '';
  const currentSidebarConfig = getSidebarConfig(userRole, state.activeSection);

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Sidebar */}
      {currentSidebarConfig && (
        <Box
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            position: 'fixed',
            left: 0,
            top: 0,
            height: '100vh',
            zIndex: 1200,
          }}
        >
          <Sidebar
            config={currentSidebarConfig}
            onItemClick={() => {}}
            onItemToggle={() => {}}
          />
        </Box>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          transition: 'margin 0.3s ease, width 0.3s ease',
          marginLeft: isSidebarOpen ? `${SIDEBAR_WIDTH}px` : 0,
          width: isSidebarOpen ? `calc(100% - ${SIDEBAR_WIDTH}px)` : '100%',
        }}
      >
        {/* App Bar */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: isSidebarOpen ? `calc(100% - ${SIDEBAR_WIDTH}px)` : '100%',
            zIndex: 1100,
            transition: 'width 0.3s ease',
          }}
        >
          <CustomAppBar
            title="DALI - APPLICATIONS"
            isSidebarOpen={isSidebarOpen && !!currentSidebarConfig}
            onMenuClick={toggleSidebar}
          />
        </Box>

        {/* Content Area */}
        <Box
          sx={{
            marginTop: `${APPBAR_HEIGHT}px`,
            minHeight: `calc(100vh - ${APPBAR_HEIGHT}px)`,
            padding: '20px',
            boxSizing: 'border-box',
            width: '100%',
            transition: 'width 0.3s ease',
            position: 'relative',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;