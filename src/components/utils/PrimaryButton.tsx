import React from "react";
import { Button, styled, ButtonProps } from "@mui/material";
import { COLORS } from "../../constants/colors";

interface PrimaryButtonProps extends Omit<ButtonProps, "theme"> {
  icon?: React.ReactNode;
  label: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  theme?: "light" | "dark";
  disabled?: boolean;
  isActive?: boolean; // To track active state
}

// Styled button with equal width and active state handling
const StyledButton = styled(Button)<{ buttonTheme?: "light" | "dark"; isActive?: boolean }>(
  ({ buttonTheme, disabled, isActive }) => ({
    backgroundColor: isActive
      ? COLORS.base.red
      : buttonTheme === "dark"
      ? COLORS.base.red
      : "transparent",
    color: isActive || buttonTheme === "dark" ? COLORS.base.white : COLORS.base.black,
    border: buttonTheme === "dark" || isActive ? "none" : `1px solid ${COLORS.base.gray}`,
    textTransform: "none",
    padding: "8px 16px",
    fontWeight: 500,
    fontSize: "0.875rem",
    borderRadius: "4px",
    transition: "all 0.2s ease-in-out",
    width: "100%",
    whiteSpace: "nowrap", // Ensure text remains in a single line
    overflow: "hidden", // Hide overflow text
    textOverflow: "ellipsis", // Add ellipsis for long text
    "& .MuiButton-startIcon": {
      marginRight: "8px",
      flexShrink: 0,
    },
    "& .MuiButton-label": {
      whiteSpace: "nowrap", // Ensure the label text stays in one line
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    "&:hover": {
      backgroundColor: COLORS.base.red,
      color: COLORS.base.white,
      border: "none",
    },
    "&:focus-visible": {
      outline: "none",
    },
    ...(disabled && {
      backgroundColor: COLORS.base.lightgray,
      color: COLORS.base.darkgray,
      border: "none",
      cursor: "not-allowed",
      "&:hover": {
        backgroundColor: COLORS.base.lightgray,
      },
    }),
  })
);


const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  icon,
  label,
  onClick,
  theme = "light",
  disabled = false,
  isActive = false,
  type = "button",
  ...props
}) => {
  return (
    <StyledButton
      type={type}
      variant="contained"
      size="small"
      onClick={onClick}
      buttonTheme={theme}
      disabled={disabled}
      startIcon={icon}
      isActive={isActive}
      aria-label={label}
      role="button"
      {...props}
    >
      {label}
    </StyledButton>
  );
};

export default PrimaryButton;
