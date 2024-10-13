import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  useMediaQuery,
  Typography,
  Checkbox,
  Box,
  ListItemButton,
  IconButton,
  InputBase,
} from "@mui/material";
import { ExpandLess, ExpandMore, Search } from "@mui/icons-material";

interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
  onItemClick: (page: string) => void;
  drawerWidth: number | string;
  sidebarItems: SidebarItem[]; // Add SidebarItem interface for dynamic items
}

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  page: string;
  subItems?: string[]; // Optional for items that have sub-items
}

const APP_BAR_HEIGHT = 65;
const BOTTOM_NAV_HEIGHT = 65;

const Sidebar: React.FC<SidebarProps> = ({
  isExpanded,
  toggleSidebar,
  onItemClick,
  drawerWidth,
  sidebarItems,
}) => {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  // Manages open states for each item that has sub-items
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleItemClick = (item: SidebarItem) => {
    if (!isExpanded) {
      toggleSidebar();
    } else if (item.subItems) {
      // Toggle open state for this specific item
      setOpenItems((prev) => ({
        ...prev,
        [item.page]: !prev[item.page],
      }));
    }
    setSelectedItem(item.page);
    if (!item.subItems) onItemClick(item.page);
  };

  const handleCheckboxClick = (
    subItem: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.stopPropagation();
    setCheckedItems((prev) => ({ ...prev, [subItem]: event.target.checked }));
    onItemClick("chapters");
  };

  const renderSubItems = (item: SidebarItem) => {
    // Filter subItems based on the searchTerm input
    const filteredSubItems = item.page === "onderwerp" && searchTerm
      ? item.subItems?.filter((subItem) =>
          subItem.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : item.subItems;
  
    return (
      <Collapse in={openItems[item.page]} timeout="auto" unmountOnExit>
        <List disablePadding>
          {(filteredSubItems || item.subItems)?.map((subItem) => (
            <ListItemButton
              key={subItem}
              sx={{
                pl: 4,
                py: 0.5,
                color: "white",
                borderLeft: "2px solid #FE6B8B",
                "&:hover": { backgroundColor: "var(--gray)" },
              }}
            >
              <Checkbox
                edge="start"
                checked={checkedItems[subItem] || false}
                onChange={(event) => handleCheckboxClick(subItem, event)}
                sx={{
                  color: "white",
                  "&.Mui-checked": { color: "var(--white)" },
                  "& .MuiSvgIcon-root": { fontSize: 20 },
                }}
              />
              <ListItemText
                primary={subItem}
                primaryTypographyProps={{
                  variant: "body2",
                  sx: {
                    color: "white",
                    fontWeight: checkedItems[subItem] ? "bold" : "normal",
                    ml: 2,
                  },
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    );
  };

  const renderSidebarContent = () => (
    <List sx={{ pt: 0 }}>
      {sidebarItems.map((item) => (
        <Box key={item.page} sx={{ mb: 0 }}>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: isExpanded ? "row" : "column",
              alignItems: isExpanded ? "flex-start" : "center",
              py: 1.5,
              backgroundColor:
                selectedItem === item.page ? "var(--red)" : "transparent",
              color: "white",
              transition: "all 0.3s",
              "&:hover": {
                backgroundColor: "#ff6b8b",
                "& .MuiListItemIcon-root": { color: "var(--black)" },
                "& .MuiTypography-root, & .MuiSvgIcon-root": {
                  color: "var(--black)",
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: "white",
                minWidth: "fit-content",
                display: "flex",
                alignSelf: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {isExpanded && (
              <>
                <ListItemText
                  primary={
                    <Typography variant="body1">{item.title}</Typography>
                  }
                  sx={{ ml: 2 }}
                />
                {item.subItems && (
                  <Box
                    sx={{ ml: "auto", display: "flex", alignSelf: "center" }}
                  >
                    {openItems[item.page] ? <ExpandLess /> : <ExpandMore />}
                  </Box>
                )}
              </>
            )}
            {!isExpanded && (
              <Typography variant="caption" fontWeight="bold" sx={{ mt: 1 }}>
                {item.title}
              </Typography>
            )}
          </ListItemButton>
          {item.subItems &&
            openItems[item.page] &&
            item.page === "onderwerp" &&
            isExpanded && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "var(--lightgray)",
                    borderRadius: "4px",
                    mt: 1,
                    mb: 2,
                    padding: "4px",
                  }}
                >
                  <IconButton sx={{ p: "5px" }} aria-label="search">
                    <Search />
                  </IconButton>
                  <InputBase
                    placeholder="Zoeken binnen onderwerp"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ ml: 1, flex: 1 }}
                    inputProps={{ "aria-label": "search" }}
                    size="small"
                  />
                </Box>
              </Box>
            )}
          {item.subItems && isExpanded && renderSubItems(item)}
        </Box>
      ))}
    </List>
  );

  return (
    <Drawer
      variant={isSmDown ? "temporary" : "permanent"}
      open={isExpanded}
      onClose={toggleSidebar}
      onMouseLeave={isExpanded ? toggleSidebar : undefined}
      sx={{
        width: isExpanded ? drawerWidth : 80,
        "& .MuiDrawer-paper": {
          width: isExpanded ? drawerWidth : 80,
          backgroundColor: "var(--darkgray)",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          height: `calc(100% - ${APP_BAR_HEIGHT}px - ${BOTTOM_NAV_HEIGHT}px)`,
          top: `${APP_BAR_HEIGHT}px`,
          position: "fixed",
          boxShadow: `4px 0 10px rgba(0,0,0,0.1)`,
        },
      }}
    >
      {renderSidebarContent()}
    </Drawer>
  );
};

export default Sidebar;
