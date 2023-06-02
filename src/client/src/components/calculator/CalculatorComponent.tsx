import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ICalculatorComponentProps {
  valA: number;
  valB: number;
  setValA: (val: React.ChangeEvent<HTMLInputElement>) => void;
  setValB: (val: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  result: number;
}

function CalculatorComponent(props: ICalculatorComponentProps) {
  const { t } = useTranslation();

  return (
    <Box
      display={'flex'}
      flexDirection={'row'}
      justifyContent={'center'}
      alignItems={'center'}
      sx={{ gap: '1rem' }}
    >
      <TextField
        label="A"
        value={props.valA}
        type="number"
        onChange={props.setValA}
        inputProps={{ 'data-testid': 'valueA-input' }}
      />
      <Typography variant="body1">+</Typography>
      <TextField
        label="B"
        value={props.valB}
        type="number"
        onChange={props.setValB}
        inputProps={{ 'data-testid': 'valueB-input' }}
      />
      <Typography variant="body1">=</Typography>
      <Typography variant="body1" data-testid="result-value">
        {props.result}
      </Typography>
      <Button
        variant="contained"
        onClick={props.onClick}
        data-testid="calculate-button"
      >
        {t('Components:Calculator:Calculate')}
      </Button>
    </Box>
  );
}

export default CalculatorComponent;
