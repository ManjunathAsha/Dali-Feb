// BottomNavBar.tsx
import React from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { Book, Place, Map, FileCopy, Group, Help } from "@mui/icons-material";
import { useTheme, useMediaQuery } from "@mui/material";

interface BottomNavBarProps {
  setSelectedPage: React.Dispatch<React.SetStateAction<string>>;
  selectedPage: string;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ selectedPage, setSelectedPage }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleNavChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedPage(newValue);
  };

  return (
    <BottomNavigation
      showLabels
      value={selectedPage}
      onChange={handleNavChange}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "auto",
        minHeight: isSmallScreen ? "60px" : "70px",
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: "#f5f5f5",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: isSmallScreen ? "0 5px" : "0 20px",
        overflowX: isSmallScreen ? "auto" : "hidden",
        "& .MuiBottomNavigationAction-root": {
          minWidth: 60,
          padding: "6px 0",
          "& .MuiSvgIcon-root": {
            fontSize: isSmallScreen ? "20px" : "24px",
          },
          "& .MuiBottomNavigationAction-label": {
            color: "black", // Default color for labels
            fontSize: isSmallScreen ? "10px" : "14px",
            marginTop: isSmallScreen ? "2px" : "6px",
            "&.Mui-selected": {
              color: "var(--red)", // Change label color to red when selected
            },
          },
          "&.Mui-selected": {
            color: "var(--red)", // Set selected color to red
            "& .MuiSvgIcon-root": {
              color: "var(--red)", // Set icon color to red when selected
            },
          },
        },
      }}
    >
      <BottomNavigationAction
        label="Handboek"
        icon={<Book />}
        value="handbook" // Set the value for the selected page
      />
      <BottomNavigationAction
        label="Raadplegen"
        icon={<Place />}
        value="raadplegen"
      />
      <BottomNavigationAction label="Kaarten" icon={<Map />} value="kaarten" />
      <BottomNavigationAction
        label="Projecten"
        icon={<FileCopy />}
        value="projecten"
      />
      <BottomNavigationAction
        label="Accounts"
        icon={<Group />}
        value="accounts"
      />
      <BottomNavigationAction
        label="Ondersteuning"
        icon={<Help />}
        value="ondersteuning"
      />
    </BottomNavigation>
  );
};

export default BottomNavBar;
