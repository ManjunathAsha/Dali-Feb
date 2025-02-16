import { Button, Drawer, styled, useTheme } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import React from "react";
import { useMediaQuery } from "@mui/system";
import { COLORS } from '../../constants/colors';
import { STYLING } from '../../constants/styling';
import { ARIA_LABELS } from '../../constants/aria';

const appBarHeight = STYLING.SIZES.HEADER_HEIGHT;

interface DrawerContainerProps {
  isOpen?: boolean;
  toggleDrawer?: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const StyledIconButton = styled(Button)(({ theme }) => ({
  borderRadius: "0px",
  color: COLORS.base.white,
  background: COLORS.base.red,
  minWidth: "10px",
  padding: "7px",
  '&:hover': {
    background: COLORS.base.darkred,
  },
  '&:focus': {
    outline: `2px solid ${COLORS.base.white}`,
    outlineOffset: '2px',
  },
  '@media (forced-colors: active)': {
    border: '2px solid ButtonText',
  },
}));

const DrawerContainer: React.FC<DrawerContainerProps> = ({
  isOpen = false,
  toggleDrawer,
  children,
  title = "Drawer content"
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <StyledIconButton
        onClick={toggleDrawer}
        style={{ 
          position: "fixed", 
          right: 10, 
          top: appBarHeight, 
          zIndex: STYLING.Z_INDEX.DRAWER + 1 
        }}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close drawer" : "Open drawer"}
      >
        {isOpen ? <ChevronRight /> : <ChevronLeft />}
      </StyledIconButton>

      <Drawer
        anchor="right"
        open={isOpen}
        variant={isSmallScreen ? "temporary" : "persistent"}
        onClose={toggleDrawer}
        aria-label={title}
        sx={{
          width: isOpen ? STYLING.SIZES.DRAWER_WIDTH : 0,
          zIndex: STYLING.Z_INDEX.DRAWER,
          flexShrink: 0,
          marginTop: 10,
          "& .MuiDrawer-paper": {
            width: isSmallScreen ? 300 : 400,
            top: appBarHeight,
            height: `calc(100vh - ${appBarHeight})`,
            boxSizing: "border-box",
            transition: STYLING.TRANSITIONS.DEFAULT,
            transform: isOpen ? "translateX(0)" : "translateX(100%)",
            backgroundColor: COLORS.base.white,
          },
        }}
      >
        {children}
      </Drawer>
    </>
  );
};

export default DrawerContainer;