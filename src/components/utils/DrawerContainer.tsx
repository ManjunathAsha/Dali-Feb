import { Button, Drawer, styled, useTheme } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import React from "react";
import { useMediaQuery } from "@mui/system";

const appBarHeight = 65;
const bottomNavHeight = 60;

interface DrawerContainerProps {
  isOpen?: boolean;
  toggleDrawer?: () => void;
  children: React.ReactNode;
}

const StyledIconButton = styled(Button)({
  borderRadius: "0px",
  color: "var(--white)",
  background: "var(--red)",
  minWidth: "10px",
  padding: "7px",
});

const DrawerContainer: React.FC<DrawerContainerProps> = ({
  isOpen,
  toggleDrawer,
  children,
}) => {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <StyledIconButton
        onClick={toggleDrawer}
        style={{ position: "fixed", right: 10, top: appBarHeight, zIndex: 2 }}
      >
        {isOpen ? <ChevronRight /> : <ChevronLeft />}
      </StyledIconButton>

      <Drawer
        anchor="right"
        open={isOpen}
        variant={isSmDown ? "temporary" : "persistent"}
        sx={{
          width: isOpen ? 400 : 0,
          zIndex: 1,
          flexShrink: 0,
          marginTop: 10,
          "& .MuiDrawer-paper": {
            width: 400,
            top: `${appBarHeight}px`,
            height: `calc(81vh - ${appBarHeight}px + ${bottomNavHeight}px)`, 
            boxSizing: "border-box",
            transition: "transform 0.3s ease-in-out",
            transform: isOpen ? "translateX(0)" : "translateX(100%)",
          },
        }}
      >
        {children}
      </Drawer>
    </>
  );
};

export default DrawerContainer;
