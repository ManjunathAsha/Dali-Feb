import React, { useEffect, useRef, useState, ChangeEvent, FormEvent } from 'react';
import { Box, Button, Container, FormControl, InputAdornment, InputLabel, Link, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AccountCircle, Https } from '@mui/icons-material';
import ForgotPassword from './ForgotPassword';
import '../../scss/Login.scss'; // Import the SCSS file
import logo from '../../assets/dali-logo-small.png'
// Define types for form data and form errors
interface FormData {
  username: string;
  password: string;
}

interface FormErrors {
  username: boolean;
  password: boolean;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/dashboard');
  };

  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    username: false,
    password: false,
  });

  const usernameRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = {
      username: formData.username === '',
      password: formData.password === '',
    };

    setFormErrors(errors);

    const hasErrors = Object.values(errors).some((error) => error);

    if (!hasErrors) {
      console.log('Logging in with:', formData);
      handleLogin();
    }
  };

  return (
    <Container className="dali-login-container" >
      <Paper className="dali-login-paper" elevation={6}>
        <img
          src={logo}
          alt="DALI Logo"
          className="dali-login-logo"
        />
        <Typography variant="h6">
        DALI LIOR - Aanmelden
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          COURSE Municipality of Zoeterwoude
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <FormControl fullWidth>
            <InputLabel shrink htmlFor="username" sx={{ fontSize: "18px", fontWeight: "bold", ml: "-12px" }}>
              Username
            </InputLabel>
            <TextField
              id="username"
              name="username"
              variant="outlined"
              placeholder="username"
              value={formData.username}
              onChange={handleChange}
              error={formErrors.username}
              helperText={formErrors.username ? "Username is required" : ""}
              inputRef={usernameRef}
              margin="normal"
              size="small"
              className="dali-login-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle  />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 1 }}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel shrink htmlFor="password" sx={{ fontSize: "18px", fontWeight: "bold", ml: "-12px" }}>
              Password
            </InputLabel>
            <TextField
              id="password"
              name="password"
              type="password"
              variant="outlined"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              helperText={formErrors.password ? "Password is required" : ""}
              margin="normal"
              size="small"
              className="dali-login-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Https />
                  </InputAdornment>
                ),
              }}
              sx={{ marginBottom: "20px" }}
            />
          </FormControl>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            className="dali-login-button"
         
          >
            To register
          </Button>
          
            <Box className="dali-login-forgotPassword" >
              <Link href="#" variant="body2" onClick={handleOpen}>
                Forgot Password?
              </Link>
            </Box>
            <Box className="dali-login-helpdesk">
              <Link href="mailto:helpdesk@example.com" variant="body2">
                Mail to DALI Helpdesk
              </Link>
            </Box>
        
        </Box>
      </Paper>
      <ForgotPassword open={open} handleClose={handleClose} />
    </Container>
  );
};

export default LoginPage;
