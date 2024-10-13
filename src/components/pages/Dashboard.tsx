import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Avatar,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ChevronRight,
  ChevronLeft,
} from "@mui/icons-material";
import Sidebar from "./Sidebar";
import "../../scss/Dashboard.scss";
import BottomNavBar from "./BottomNavBar";
import logo from "../../assets/dali-logo.png";
import Handbook from "./Handbook/Handbook";
import {
  MenuBook,
  AccountTree,
  NearMe,
  LocationOn,
  Subject,
} from "@mui/icons-material";

const Dashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const [selectedPage, setSelectedPage] = useState("handbook");

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const expandedDrawerWidth = 300;
  const collapsedDrawerWidth = 80;
  const appBarHeight = 64;
  const bottomNavHeight = 60;

  const sidebarItems = [
    {
      title: "Chapter",
      icon: <MenuBook />,
      page: "chapters",
      subItems: [
        "01. Planproces",
        "02. Groenvoorzieningen",
        "03. Speelvoorzieningen",
        "04. Weginfrastructuur",
      ],
    },
    {
      title: "Niveau",
      icon: <AccountTree />,
      page: "niveau",
    },
    { title: "Woonkern", icon: <NearMe />, page: "woonkern" },
    { title: "Gebied", icon: <LocationOn />, page: "gebied" },
    {
      title: "Onderwerp",
      icon: <Subject />,
      page: "onderwerp",
      subItems: [
        "Aanleg groenvoorzieningen",
        "Aansluitingen particulier perceel op openbare ruimte",
        "Aanvullingen",
        "Beleid",
        "Beschoeiing",
        "Betonnen bruggen",
        "Bodemverontreiniging",
        "Boombescherming",
        "Borden",
      ],
    },
  ];

  const renderPageContent = () => {
    switch (selectedPage) {
      case "home":
        return <Handbook />;
      case "raadplegen":
        return <div>Kaarten Content</div>;
      case "kaarten":
        return <div>Kaarten Content</div>;
      case "projecten":
        return <div>Projecten Content</div>;
      case "accounts":
        return <div>Accounts Content</div>;
      case "ondersteuning":
        return <div>Ondersteuning Content</div>;
      default:
        return <Handbook />;
    }
  };

  const handleSidebarItemClick = (page: string) => {
    setSelectedPage(page);
    if (!isSidebarExpanded) {
      setIsSidebarExpanded(true);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: "#ffffff",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Adding shadow for embossed look
          borderBottom: "1px solid #e0e0e0",
          transform: "translateY(0)", // Ensures it's slightly lifted from the background
          transition: "all 0.3s ease", // Smooth transition for any changes
          "&:hover": {
            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)", // Slightly more pronounced shadow on hover
          },
        }}
      >
        <Toolbar
          sx={{
            minHeight: appBarHeight,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Sidebar Toggle and Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              aria-label="toggle drawer"
              onClick={toggleSidebar}
              edge="start"
              sx={{ mr: 2, color: "#C2185B" }}
            >
              {isSidebarExpanded ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src={logo}
                alt="Logo"
                style={{ height: "30px", marginRight: "10px" }}
              />
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ color: "#3b3b3b", fontWeight: "bold" }}
              >
                Dali
              </Typography>
            </Box>
          </Box>

          {/* Search Bar */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: 2,
            }}
          >
            <Box
              sx={{
                position: "relative",
                borderRadius: theme.shape.borderRadius,
                backgroundColor: "#f1f3f4",
                width: "100%",
                maxWidth: 400,
              }}
            >
              <InputBase
                placeholder="Search…"
                startAdornment={<SearchIcon sx={{ ml: 1 }} />}
                sx={{ pl: 4, width: "100%", py: 0.5 }}
              />
            </Box>
          </Box>

          {/* Action Icons */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              sx={{
                backgroundColor: "#C2185B",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#b01750", // Slightly darker shade on hover
                },
                p: 1, // Padding to ensure the icon fits well within the button
              }}
            >
              <NotificationsIcon />
            </IconButton>

            <IconButton
              sx={{
                backgroundColor: "#C2185B",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#b01750", // Slightly darker shade on hover
                },
                p: 1, // Padding to ensure the icon fits well within the button
                ml: 2, // Margin left for spacing between buttons
              }}
            >
              <SettingsIcon />
            </IconButton>

            <IconButton
              sx={{
                backgroundColor: "#C2185B",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#b01750",
                },
                p: 1, // Padding to ensure the icon fits well within the button
                ml: 2, // Margin left for spacing between buttons
              }}
            >
              <SettingsIcon />
            </IconButton>

            <Avatar
              alt="User Name"
              src="/static/images/avatar/1.jpg"
              sx={{
                backgroundColor: "#C2185B",
                color: "#ffffff",
                ml: 2, // Margin left for spacing between the avatar and the icon button
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      <Box className="side-bar-content">
        <Sidebar
          isExpanded={isSidebarExpanded}
          toggleSidebar={toggleSidebar}
          onItemClick={handleSidebarItemClick}
          drawerWidth={
            isSidebarExpanded ? expandedDrawerWidth : collapsedDrawerWidth
          }
          sidebarItems={sidebarItems}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "stretch",
            minWidth: 0,
            maxWidth: {
              sm: `calc(100% - ${isSidebarExpanded ? expandedDrawerWidth : collapsedDrawerWidth}px)`,
              xs: "100%",
            },
            ml: {
              sm: `${isSidebarExpanded ? expandedDrawerWidth : collapsedDrawerWidth}px`,
              xs: 0,
            },
            mt: `${appBarHeight}px`,
            mb: `${bottomNavHeight}px`,
            overflowX: "hidden",
            overflowY: "hidden",
            boxSizing: "border-box",
          }}
        >
          {selectedPage === "chapters" && <Handbook />}
          <Box>{renderPageContent()}</Box>
        </Box>
      </Box>

      <BottomNavBar selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
    </Box>
  );
};

export default Dashboard;
