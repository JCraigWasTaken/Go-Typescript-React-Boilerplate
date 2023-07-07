import { Box, Button, TextField, Typography } from '@mui/material';
import Hook, { IUseCalculatorProps } from './useCalculator';

export interface ICalculatorComponentProps extends IUseCalculatorProps {}

function CalculatorComponent(props: ICalculatorComponentProps) {
  const useCalculatorProps = {
    onClick: props.onClick,
  };
  const { t, valA, valB, result, onChangeValA, onChangeValB, onClick } =
    Hook.useCalculator(useCalculatorProps);

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
        value={valA}
        type="number"
        onChange={onChangeValA}
        inputProps={{ 'data-testid': 'valueA-input' }}
      />
      <Typography variant="body1">+</Typography>
      <TextField
        label="B"
        value={valB}
        type="number"
        onChange={onChangeValB}
        inputProps={{ 'data-testid': 'valueB-input' }}
      />
      <Typography variant="body1">=</Typography>
      <Typography variant="body1" data-testid="result-value">
        {result}
      </Typography>
      <Button
        variant="contained"
        onClick={onClick}
        data-testid="calculate-button"
      >
        {t('Components:Calculator:Calculate')}
      </Button>
    </Box>
  );
}

export default CalculatorComponent;
