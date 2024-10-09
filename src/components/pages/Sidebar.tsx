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
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  MenuBook,
  AccountTree,
  NearMe,
  LocationOn,
} from "@mui/icons-material";

interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
  onItemClick: (page: string) => void;
  drawerWidth: number | string;
}

const APP_BAR_HEIGHT = 65;
const BOTTOM_NAV_HEIGHT = 65;

const Sidebar: React.FC<SidebarProps> = ({
  isExpanded,
  toggleSidebar,
  onItemClick,
  drawerWidth,
}) => {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  const [openChapter, setOpenChapter] = useState(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [selectedItem, setSelectedItem] = useState<string>("chapters");

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
    { title: "Niveau", icon: <AccountTree />, page: "niveau" },
    { title: "Woonkern", icon: <NearMe />, page: "woonkern" },
    { title: "Gebied", icon: <LocationOn />, page: "gebied" },
  ];

  const handleItemClick = (item: typeof sidebarItems[0]) => {
    if (!isExpanded) {
      toggleSidebar();
    } else if (item.subItems) {
      setOpenChapter(!openChapter);
      setSelectedItem(item.page);
    } else {
      setSelectedItem(item.page);
      onItemClick(item.page);
    }
  };

  const handleCheckboxClick = (
    subItem: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.stopPropagation();
    setCheckedItems((prev) => ({ ...prev, [subItem]: event.target.checked }));
    onItemClick("chapters");
  };

  const renderSidebarContent = () => (
    <List sx={{ pt: 0 }}>
      {sidebarItems.map((item, index) => (
        <Box key={index} sx={{ mb: 0 }}>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            sx={{
              display: "flex",
              flexDirection: isExpanded ? "row" : "column",
              alignItems: isExpanded ? "flex-start" : "center",
              justifyContent: "flex-start",
              py: 1.5,
              backgroundColor:
                selectedItem === item.page ? "var(--black)" : "transparent",
              color: "white",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: "#ff6b8b",
                "& .MuiListItemIcon-root": { color: "var(--black)" },
                "& .MuiTypography-root, & .MuiSvgIcon-root": { color: "var(--black)" },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: "white",
                minWidth: 40,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transition: "all 0.3s ease-in-out",
                alignSelf: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {isExpanded ? (
              <>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      sx={{ textAlign: "left" }}
                    >
                      {item.title}
                    </Typography>
                  }
                  sx={{ ml: 2, whiteSpace: "nowrap" }}
                />
                {item.subItems && (
                  <Box sx={{ ml: "auto" }}>
                    {openChapter ? <ExpandLess /> : <ExpandMore />}
                  </Box>
                )}
              </>
            ) : (
              <Typography
                variant="caption"
                fontWeight="bold"
                sx={{ mt: 1, textAlign: "center" }}
              >
                {item.title}
              </Typography>
            )}
          </ListItemButton>

          {item.subItems && isExpanded && (
            <Collapse in={openChapter} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ backgroundColor: "#501c28" }}>
                {item.subItems.map((subItem, subIndex) => (
                  <ListItemButton
                    key={subIndex}
                    sx={{
                      pl: 4,
                      py: 0.5,
                      color: "white",
                      borderLeft: "2px solid #FE6B8B",
                      "&:hover": {
                        backgroundColor: "var(--gray)",
                        // color: "var(--black)",
                        // "& .MuiTypography-root": { color: "black" },
                        // "& .MuiCheckbox-root": { color: "black" },
                      },
                    }}
                  >
                    <Checkbox
                      edge="start"
                      checked={checkedItems[subItem] || false}
                      onChange={(event) => handleCheckboxClick(subItem, event)}
                      sx={{
                        color: "white",
                        "&.Mui-checked": { color: "var(--black)" },
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
                          transition: "color 0.3s",
                          ml: 2,
                          alignSelf: "center",
                        },
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          )}
        </Box>
      ))}
    </List>
  );

  return (
    <Drawer
      variant={isSmDown ? "temporary" : "permanent"}
      open={isExpanded}
      onClose={toggleSidebar}
      onMouseLeave={() => {
        if (isExpanded) {
          toggleSidebar();
        }
      }}
      sx={{
        width: isExpanded ? drawerWidth : 80,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isExpanded ? drawerWidth : 80,
          backgroundColor: "var(--darkgray)",
          overflowX: "hidden",
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
