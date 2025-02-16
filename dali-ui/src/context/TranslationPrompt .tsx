import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const TranslationPrompt: React.FC = () => {
  const { language, setLanguage, t, showTranslationPrompt, setShowTranslationPrompt } = useLanguage();

  const handleTranslate = () => {
    const detectedLanguage = navigator.language.split('-')[0];
    const supportedLanguages = ['en', 'nl']; // Add more as needed
    if (supportedLanguages.includes(detectedLanguage)) {
      setLanguage(detectedLanguage);
    }
    setShowTranslationPrompt(false);
  };

  const handleDecline = () => {
    setShowTranslationPrompt(false);
  };

  return (
    <Dialog open={showTranslationPrompt} onClose={handleDecline}>
      <DialogTitle>{t('translationPrompt.title')}</DialogTitle>
      <DialogContent>
        {t('translationPrompt.message')}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDecline}>{t('translationPrompt.decline')}</Button>
        <Button onClick={handleTranslate} autoFocus>
          {t('translationPrompt.accept')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TranslationPrompt;