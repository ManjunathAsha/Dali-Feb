import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button, Typography, Box } from '@mui/material';

const TranslationDemo = () => {
  const { t, language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'nl' : 'en');
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4">{t('common.welcome')}</Typography>
      <Typography>{t('common.currentLanguage', { lang: language })}</Typography>
      <Button onClick={toggleLanguage} variant="contained" sx={{ mt: 2 }}>
        {t('common.switchLanguage')}
      </Button>
    </Box>
  );
};

export default TranslationDemo;