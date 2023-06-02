import React from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

function ErrorComponent() {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h1" data-testid="errorMessage">
        {t('Pages:ErrorPage:Error')}
      </Typography>
    </>
  );
}

export default ErrorComponent;
