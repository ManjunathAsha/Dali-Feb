import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, Place, Map, FileCopy, Group, Help } from '@mui/icons-material';
import { useTheme, useMediaQuery } from '@mui/material';

const BottomNavBar: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // Adjust for screen size < 768px

  return (
    <BottomNavigation
      showLabels
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'auto', // Allow the navigation to adjust its height
        minHeight: isSmallScreen ? '60px' : '70px', // Adjust height for small screens
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: '#f5f5f5',
        display: 'flex',
        justifyContent: 'space-around', // Evenly space the icons
        alignItems: 'center',
        padding: isSmallScreen ? '0 5px' : '0 20px',
        overflowX: isSmallScreen ? 'auto' : 'hidden', // Enable horizontal scroll on small screens if needed
        '& .MuiBottomNavigationAction-root': {
          minWidth: 60, // Force a minimum width to prevent cramping
          padding: '6px 0', // Adjust padding to fit more items
          '& .MuiSvgIcon-root': {
            fontSize: isSmallScreen ? '20px' : '24px', // Smaller icons for small screens
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: isSmallScreen ? '10px' : '14px', // Smaller font for small screens
            marginTop: isSmallScreen ? '2px' : '6px',
          },
        },
      }}
    >
      <BottomNavigationAction label="Home" icon={<Home />} />
      <BottomNavigationAction label="Raadplegen" icon={<Place />} />
      <BottomNavigationAction label="Kaarten" icon={<Map />} />
      <BottomNavigationAction label="Projecten" icon={<FileCopy />} />
      <BottomNavigationAction label="Accounts" icon={<Group />} />
      <BottomNavigationAction label="Ondersteuning" icon={<Help />} />
    </BottomNavigation>
  );
};

export default BottomNavBar;
