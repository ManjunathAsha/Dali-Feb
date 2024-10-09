import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import '../../scss/Login.scss';

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  open,
  handleClose,
}) => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = email === "";
    setError(error);
    if (!error) {
      console.log("Email:", email);
    }
  };

  const handleCancel = () => {
    handleClose();
    setEmail("");
    setError(false);
  };

  return (
    <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box className="dali-forgotpassword-modalBox">
      <Typography
        id="modal-modal-title"
        variant="h6"
        component="h2"
        sx={{
          p: "1px 1px 1px 10px",
          border: "0.5px solid var(--lightgray)",
          background: "var(--fade)",
        }}
      >
        Request new password
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
        <Typography id="modal-modal-description">
          Enter your account email address below. You will receive an email
          with a new password within a few minutes.
        </Typography>
        <Divider sx={{ mt: 1 }} />
        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel
            shrink
            htmlFor="email"
            sx={{ fontSize: "18px", fontWeight: "bold", ml: "-12px" }}
          >
            Email
          </InputLabel>
          <TextField
            id="email"
            name="email"
            type="email"
            variant="outlined"
            placeholder="email"
            value={email}
            onChange={handleChange}
            error={error}
            helperText={error ? "Email is required" : ""}
            margin="normal"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
            sx={{ marginBottom: "20px" }}
          />
        </FormControl>
        <Box className= "dali-forgotpassword-modalButtonContainer">
          <Button
            fullWidth
            type="submit"
            variant="contained"
            className="dali-login-button"
            sx={{
              backgroundColor: "#E53935",
              color: "#fff",
              "&:hover": {
                backgroundColor: "grey",
              },
            }}
          >
            To Request
          </Button>
          <Button
            fullWidth
            type="button" // Changed to 'button' because this is not submitting the form
            variant="contained"
             className="dali-login-button"
            onClick={handleCancel}
            sx={{
              backgroundColor: "#E53935",
              color: "#fff",
              "&:hover": {
                backgroundColor: "grey",
              },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  </Modal>
  );
};

export default ForgotPassword;
