import React, { useState } from "react";
import { Button, Menu, MenuItem, styled, Typography } from "@mui/material";
import { Edit, Delete, Send } from "@mui/icons-material";
import BuildIcon from "@mui/icons-material/Build";

const StyledButton = styled(Button)(() => ({
  backgroundColor: "var(--red)",
  textTransform: "none",
}));

interface ActionsDropdownProps {
  handleEdit: () => void;
  handleDelete: () => void;
  handleShare: () => void;
}

const ActionsDropdown: React.FC<ActionsDropdownProps> = ({
  handleEdit,
  handleDelete,
  handleShare,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleActions = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const StyledMenuItem = styled(MenuItem)(() => ({
    display: "flex",
    gap: "10px",
    color: "var(--white)",
    background: "var(--darkgray)",
    ":hover": {
      background: "var(--red)",
    },
  }));

  return (
    <>
      <StyledButton
        onClick={handleActions}
        variant="contained"
        color="secondary"
        startIcon={<BuildIcon />}
      >
        <Typography>Acties</Typography>
      </StyledButton>
      <Menu
        sx={{
          "& .MuiMenu-list": {
            background: "var(--darkgray)",
          },
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <StyledMenuItem onClick={handleEdit}>
          <Edit fontSize="small" /> Wijzigen
        </StyledMenuItem>
        <StyledMenuItem onClick={handleDelete}>
          <Delete fontSize="small" /> Verwijderen uit handboek
        </StyledMenuItem>
        <StyledMenuItem onClick={handleShare}>
          <Send fontSize="small" /> Doorsturen naar de uitgever
        </StyledMenuItem>
      </Menu>
    </>
  );
};

export default ActionsDropdown;
