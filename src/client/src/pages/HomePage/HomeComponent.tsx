import React from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import CalculatorContainer from '../../components/calculator/CalculatorContainer';

interface IHomeComponentProps {
  apiStatus: string;
  clientCalcResult: number;
  serverCalcResult: number;
  onClientCalcClick: (a: number, b: number) => void;
  onServerCalcClick: (a: number, b: number) => void;
}

function HomeComponent(props: IHomeComponentProps) {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h1">{t('Pages:HomePage:Home')}</Typography>
      <Typography variant="h2" data-testid="apiStatus">{`${t(
        'Pages:HomePage:API Status'
      )}: ${props.apiStatus}`}</Typography>
      <Typography variant="h2">
        {t('Pages:HomePage:Client Calculator')}
      </Typography>
      <CalculatorContainer
        onClick={props.onClientCalcClick}
        result={props.clientCalcResult}
      />
      <Typography variant="h2">
        {t('Pages:HomePage:Server Calculator')}
      </Typography>
      <CalculatorContainer
        onClick={props.onServerCalcClick}
        result={props.serverCalcResult}
      />
    </>
  );
}

export default HomeComponent;
