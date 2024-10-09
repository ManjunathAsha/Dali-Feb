import React from "react";
import { Button } from "@mui/material";

interface IconLabel {
  icon?: React.ReactNode;
  label: string;
  onClick?: any;
  theme?: string;
}

function PrimaryButton({ icon, label, onClick, theme }: IconLabel) {
  return (
    <Button
      type="button"
      variant="contained"
      size="small"
      onClick={onClick}
      sx={{
        backgroundColor: theme ? "var(--red)" : "transparent",
        color: theme ? "var(--white)" : "var(--black)",
        border: theme ? "none" : "1px solid var(--gray)",
        textTransform: "none",
        "&:hover": {
          backgroundColor: theme ? "var(--black)" : "var(--red)",
          color: "var(--white)",
        },
      }}
      startIcon={icon}
    >
      {label}
    </Button>
  );
}

export default PrimaryButton;
