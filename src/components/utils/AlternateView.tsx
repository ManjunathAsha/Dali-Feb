import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Chapter {
  id: string;
  name: string;
  content: string;
}

interface AlternateViewProps {
  chapters: Chapter[];
}

const AlternateView: React.FC<AlternateViewProps> = ({ chapters }) => {
  return (
    <Box sx={{ bgcolor: '#f0f0ff', p: 2, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Discount Specific Information</Typography>
      {chapters.map((chapter) => (
        <Accordion key={chapter.id} sx={{ mb: 1, '&:before': { display: 'none' } }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              bgcolor: '#e0e0ff', 
              '&.Mui-expanded': { minHeight: 48 },
              '& .MuiAccordionSummary-content': { m: 0 }
            }}
          >
            <Typography>{chapter.name}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Typography sx={{ p: 2 }}>{chapter.content}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default AlternateView;