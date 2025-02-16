import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { COLORS } from '../../constants/colors';


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
    <Box 
      sx={{ 
        bgcolor: COLORS.base.fade, 
        p: 2, 
        borderRadius: 2 
      }}
      role="region"
      aria-label="Chapter information"
    >
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2,
          color: COLORS.base.black,
        }}
      >
        Discount Specific Information
      </Typography>
      {chapters.map((chapter) => (
        <Accordion 
          key={chapter.id} 
          sx={{ 
            mb: 1, 
            '&:before': { display: 'none' },
            backgroundColor: COLORS.base.white,
            '&:focus-within': {
              outline: `2px solid ${COLORS.base.darkgray}`,
            }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-label={`Chapter ${chapter.name}`}
            sx={{ 
              bgcolor: COLORS.base.lightgray1,
              color: COLORS.base.black,
              '&.Mui-expanded': { minHeight: 48 },
              '& .MuiAccordionSummary-content': { m: 0 },
              '&:hover': {
                bgcolor: COLORS.base.lightgray,
              },
              '&:focus': {
                bgcolor: COLORS.base.lightgray,
                outline: `2px solid ${COLORS.base.darkgray}`,
              }
            }}
          >
            <Typography>{chapter.name}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2, backgroundColor: COLORS.base.white }}>
            <Typography sx={{ color: COLORS.base.black }}>
              {chapter.content}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default AlternateView;