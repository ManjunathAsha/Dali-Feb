import React from 'react';
import {
  Button,
  ButtonProps,
  CircularProgress,
  styled,
} from '@mui/material';

interface AccessibleButtonProps extends ButtonProps {
  loading?: boolean;
}

const StyledButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
  '&:focus-visible': {
    outline: `3px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
  },
}));

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  loading,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <CircularProgress
            size={24}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
          <span className="visually-hidden">Loading...</span>
        </>
      ) : (
        children
      )}
    </StyledButton>
  );
};