import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  InputBase, 
  Box,
  Menu,
  MenuItem,
  Avatar,
  Fade,
  styled,
  Badge,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import HelpIcon from '@mui/icons-material/Help';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/AuthContext';
import { COLORS } from '../../../constants/colors';
import Map from '@mui/icons-material/Map';
import { ProfileSettings } from './ProfileSettings';
import { MapModal } from '../ExtenalMap/MapModal';
import { useSidebar } from '../../../context/SidebarContext';

// Constants
const ICON_SIZE = 24; // Base icon size
const AVATAR_SIZE = 32; // Avatar size

type Role = 'admin' | 'owner' | 'reader' | 'publisher';

interface CustomAppBarProps {
  title?: string;
  onMenuClick?: () => void;
  isSidebarOpen: boolean;
  isDashboard?: boolean;
  userName?: string;
}

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(1),
  '& .MuiSvgIcon-root': {
    fontSize: ICON_SIZE,
  },
}));

const StyledSearch = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '24px',
  backgroundColor: COLORS.base.fade,
  '&:hover': {
    backgroundColor: COLORS.base.lightgray1,
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  maxWidth: '300px',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: COLORS.base.darkgray,
  '& .MuiSvgIcon-root': {
    fontSize: ICON_SIZE,
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: COLORS.base.darkgray,
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    height: ICON_SIZE,
    lineHeight: `${ICON_SIZE}px`,
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
  },
}));

const UserMenuItem = styled(MenuItem)({
  gap: '12px',
  padding: '8px 16px',
  height: 40,
  '&:hover': {
    backgroundColor: COLORS.base.fade,
  },
  '& .MuiSvgIcon-root': {
    fontSize: ICON_SIZE,
  },
});

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 3,
  },
}));

const RoleChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'roleColor',
})<{ roleColor: string }>(({ roleColor }) => ({
  backgroundColor: `${roleColor}20`,
  color: roleColor,
  padding: '4px 12px',
  borderRadius: '12px',
  fontSize: '0.75rem',
  fontWeight: 600,
  marginTop: '4px',
  display: 'inline-block'
}));

// Helper Functions
const getAvatarText = (name: string): string => {
  return name.split(' ').map(part => part[0]).join('').toUpperCase();
};

const getRoleLabel = (role: Role): string => {
  const roleLabels: Record<Role, string> = {
    admin: 'Administrator',
    owner: 'Owner',
    reader: 'Reader',
    publisher: 'Publisher'
  };
  return roleLabels[role] || role;
};

const getRoleColor = (role: Role): string => {
  const roleColors: Record<Role, string> = {
    admin: COLORS.base.red,
    owner: COLORS.base.blue,
    reader: COLORS.base.darkgray,
    publisher: COLORS.base.green,
  };
  return roleColors[role] || COLORS.base.darkgray;
};

const CustomAppBar: React.FC<CustomAppBarProps> = ({
  title = "",
  onMenuClick,
  isSidebarOpen,
  isDashboard = false,
  userName = "User Name"
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const navigate = useNavigate();
  const { userInfo, logout } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { toggleSidebar } = useSidebar();

  // Add null checks for userInfo and role
  const role = userInfo?.role || '';
  const roleLabel = role ? getRoleLabel(role.toLowerCase() as Role) : '';
  const roleColor = role ? getRoleColor(role.toLowerCase() as Role) : COLORS.base.darkgray;

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    localStorage.removeItem('userToken');
    localStorage.removeItem('refreshToken');
    logout();
    navigate('/login');
  };

  const handleSettingsOpen = () => {
    setIsSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setIsSettingsOpen(false);
  };

  const handleMapOpen = () => {
    setIsMapOpen(true);
  };

  const handleMapClose = () => {
    setIsMapOpen(false);
  };

  const handleMenuClick = () => {
    if (onMenuClick) {
      onMenuClick();
    } else {
      toggleSidebar();
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        width: isSidebarOpen && !isDashboard ? `calc(100% - 300px)` : '100%',
        marginLeft: isSidebarOpen && !isDashboard ? '300px' : 0,
        backgroundColor: COLORS.base.white,
        color: COLORS.base.red,
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        transition: theme => theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      <Toolbar sx={{ minHeight: 56 }}>
        {!isDashboard && (
          <>
            <StyledIconButton
              color="inherit"
              aria-label="toggle sidebar"
              edge="start"
              onClick={handleMenuClick}
            >
              <MenuIcon />
            </StyledIconButton>
            <StyledIconButton 
              color="inherit" 
              aria-label="home" 
              onClick={() => navigate('/dashboard')}
            >
              <HomeIcon />
            </StyledIconButton>
          </>
        )}

        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 600,
            fontSize: '1.125rem',
          }}
        >
          {title}
        </Typography>

        {!isDashboard && (
          <StyledSearch>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Zoeken op trefwoord..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </StyledSearch>
        )}

        {/* {!isDashboard && (
          <StyledIconButton color="inherit" aria-label="notifications">
            <StyledBadge badgeContent={4} color="error">
              <NotificationsIcon />
            </StyledBadge>
          </StyledIconButton>
        )} */}

        <StyledIconButton
          onClick={handleProfileClick}
          aria-controls={open ? 'profile-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          sx={{ 
            ml: 1,
            padding: 0.5,
          }}
        >
          <Avatar 
            sx={{ 
              bgcolor: roleColor,
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
              fontSize: AVATAR_SIZE * 0.5,
            }}
          >
            {getAvatarText(userName)}
          </Avatar>
        </StyledIconButton>

        <Menu
          anchorEl={anchorEl}
          id="profile-menu"
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
          PaperProps={{
            elevation: 3,
            sx: {
              minWidth: '200px',
              mt: 1.5,
              '& .MuiList-root': {
                py: 1,
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {userName}
            </Typography>
            <RoleChip roleColor={roleColor}>
              {roleLabel}
            </RoleChip>
          </Box>
          <Divider />
          <UserMenuItem onClick={handleClose}>
            <PersonIcon sx={{ color: roleColor }} />
            <Typography>Profile</Typography>
          </UserMenuItem>
          {(userInfo && (userInfo.role === 'admin' || userInfo.role === 'owner')) && (
            <UserMenuItem onClick={handleClose}>
              <NotificationsIcon sx={{ color: roleColor }} />
              <Typography>Notifications</Typography>
            </UserMenuItem>
          )}
          <UserMenuItem onClick={handleSettingsOpen}>
            <SettingsIcon sx={{ color: roleColor }} />
            <Typography>Settings</Typography>
          </UserMenuItem>
          <Divider />
          <UserMenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ color: COLORS.base.red }} />
            <Typography color={COLORS.base.red}>Sign Out</Typography>
          </UserMenuItem>
        </Menu>

        {!isDashboard && (
          <StyledIconButton 
            color="inherit" 
            aria-label="Open map"
            onClick={handleMapOpen}
          >
            <Map />
          </StyledIconButton>
        )}

        {!isDashboard && (
          <StyledIconButton 
            color="inherit" 
            aria-label="help"
            sx={{ ml: 1 }}
          >
            <HelpIcon />
          </StyledIconButton>
        )}
      </Toolbar>


      <ProfileSettings
        isOpen={isSettingsOpen}
        onClose={handleSettingsClose}
        userData={{
          username: userName,
          email: "user@example.com", // Replace with actual data
          firstName: "John", // Replace with actual data
          lastName: "Doe", // Replace with actual data
        }}
      />

      {/* Modal for Map */}
      <MapModal
        isOpen={isMapOpen}
        onClose={handleMapClose}
      />
    </AppBar>

    
  );
};

export default CustomAppBar;