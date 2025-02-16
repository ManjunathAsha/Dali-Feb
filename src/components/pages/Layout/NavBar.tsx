import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  Button,
  Box,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Help as HelpIcon,
  Home as HomeIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import UserOverview from "../UserCreation/UserOverviews"; // Import UserOverview component
import NewUser from "../UserCreation/NewUser"; // Import NewUser component
import "../../../scss/NavBar.scss"; // Adjust the path
import { ROUTES } from "../../../constants/routes";

const NavBar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar toggle state
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false); // NewUser modal toggle
  const [isUserOverviewVisible, setIsUserOverviewVisible] = useState(true); // Toggle UserOverview visibility
  const navigate = useNavigate();

  const toggleSidebar = (open: boolean) => {
    setSidebarOpen(open);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const sidebarContent = (
    <Box
      sx={{
        width: 300,
        backgroundColor: "#f5f5f5",
        height: "100%",
      }}
      role="presentation"
    >
      <Box
        sx={{
          padding: "16px",
          backgroundColor: "#673ab7",
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          User Management
        </Typography>
      </Box>
      <Divider />
      <List>
        {/* New User Button */}
        <ListItem disablePadding>
          <Button
            fullWidth
            startIcon={<AddIcon sx={{ color: "#673ab7" }} />}
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              color: "#000",
              fontSize: "16px",
              padding: "12px 16px",
              "&:hover": {
                backgroundColor: "#e0e7ff",
              },
              "&:active": {
                backgroundColor: "#c7d2fe",
              },
            }}
            onClick={() => {
              setIsNewUserModalOpen(true);
              closeSidebar();
            }}
          >
            New User
          </Button>
        </ListItem>

        {/* User Overview Button */}
        <ListItem disablePadding>
          <Button
            fullWidth
            startIcon={<PersonIcon sx={{ color: "#673ab7" }} />}
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              color: "#000",
              fontSize: "16px",
              padding: "12px 16px",
              "&:hover": {
                backgroundColor: "#e0e7ff",
              },
              "&:active": {
                backgroundColor: "#c7d2fe",
              },
            }}
            onClick={() => {
              setIsUserOverviewVisible(true);
              closeSidebar();
            }}
          >
            User Overview
          </Button>
        </ListItem>

        {/* Last Logged In Button */}
        <ListItem disablePadding>
          <Button
            fullWidth
            startIcon={<PersonIcon sx={{ color: "#673ab7" }} />}
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              color: "#000",
              fontSize: "16px",
              padding: "12px 16px",
              "&:hover": {
                backgroundColor: "#e0e7ff",
              },
              "&:active": {
                backgroundColor: "#c7d2fe",
              },
            }}
            onClick={() => navigate("/last-logged-in")}
          >
            Last Logged In
          </Button>
        </ListItem>

        {/* Users by Role Button */}
        <ListItem disablePadding>
          <Button
            fullWidth
            startIcon={<PersonIcon sx={{ color: "#673ab7" }} />}
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              color: "#000",
              fontSize: "16px",
              padding: "12px 16px",
              "&:hover": {
                backgroundColor: "#e0e7ff",
              },
              "&:active": {
                backgroundColor: "#c7d2fe",
              },
            }}
            onClick={() => navigate(ROUTES.USERCREATION.USERBYROLES)}
          >
            Users by Role
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* AppBar */}
      <AppBar position="static" className="navbar">
        <Toolbar className="navbar__toolbar">
          <Box className="navbar__left" sx={{ display: "flex", alignItems: "center" }}>
            {/* Sidebar Toggle Button */}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              className="navbar__menu"
              onClick={() => toggleSidebar(!sidebarOpen)}
            >
              {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>

            {/* Home Icon */}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="home"
              className="navbar__home"
              onClick={() => navigate("/dashboard")}
              sx={{ ml: 1 }}
            >
              <HomeIcon />
            </IconButton>
          </Box>
          <Typography variant="h6" className="navbar__title">
            USER MANAGEMENT
          </Typography>
          <Box className="navbar__right">
            <IconButton color="inherit" className="navbar__icon">
              <PersonIcon />
            </IconButton>
            <IconButton color="inherit" className="navbar__icon">
              <HelpIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }}>
        {/* Sidebar */}
        {sidebarOpen && (
          <Drawer
            variant="persistent"
            anchor="left"
            open={sidebarOpen}
            sx={{
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: 300,
                boxSizing: "border-box",
              },
            }}
          >
            {sidebarContent}
          </Drawer>
        )}

        {/* UserOverview */}
        <Box
          sx={{
            flex: 1,
            transition: "all 0.3s ease",
            marginLeft: sidebarOpen ? "300px" : "0",
            width: sidebarOpen ? "calc(100% - 300px)" : "100%",
          }}
        >
          <UserOverview />
        </Box>
      </Box>

      {/* New User Modal */}
      {isNewUserModalOpen && (
        <NewUser
          isModalOpen={isNewUserModalOpen}
          onClose={() => setIsNewUserModalOpen(false)}
          toggleSidebar={(open) => () => toggleSidebar(open)}
        />
      )}
    </Box>
  );
};

export default NavBar;