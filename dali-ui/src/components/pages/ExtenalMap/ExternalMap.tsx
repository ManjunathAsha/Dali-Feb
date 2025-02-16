import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel } from '@mui/material';
import Layout from '../Layout/Layout';

const ExternalMaps: React.FC = () => {
  return (
  <Layout>

      <Typography
        variant="h5"
        sx={{
          mb: 3,
        }}
      >
        Klik minimaal op 1 selectievakje om een externe kaart te raadplegen
      </Typography>
        
  </Layout>
  );
};

export default ExternalMaps;
