import React from 'react';
import {
  TextField,
  InputAdornment,
  TextFieldProps,
  styled,
} from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface AccessibleTextFieldProps extends Omit<TextFieldProps, 'variant'> {
  icon?: SvgIconComponent;
}

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.light,
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },
}));

export const AccessibleTextField: React.FC<AccessibleTextFieldProps> = ({
  icon: Icon,
  ...props
}) => {
  return (
    <StyledTextField
      variant="outlined"
      fullWidth
      InputProps={{
        startAdornment: Icon && (
          <InputAdornment position="start">
            <Icon color="action" />
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};