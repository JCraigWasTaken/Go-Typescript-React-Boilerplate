import { Typography } from '@mui/material';
import Hook, { IUseHomePageProps } from './useHomePage';
import CalculatorComponent from '../../components/calculator/CalculatorComponent';

export interface IHomePageProps extends IUseHomePageProps {}

function HomePage(props: IHomePageProps) {
  const useHomePageProps = {};
  const {
    t,
    apiStatus,
    handleCalculatorClick_Client,
    handleCalculatorClick_Server,
  } = Hook.useHomePage(useHomePageProps);

  return (
    <>
      <Typography variant="h1">{t('Pages:HomePage:Home')}</Typography>
      <Typography variant="h2" data-testid="apiStatus">{`${t(
        'Pages:HomePage:API Status'
      )}: ${apiStatus}`}</Typography>
      <Typography variant="h2">
        {t('Pages:HomePage:Client Calculator')}
      </Typography>
      <CalculatorComponent onClick={handleCalculatorClick_Client} />
      <Typography variant="h2">
        {t('Pages:HomePage:Server Calculator')}
      </Typography>
      <CalculatorComponent onClick={handleCalculatorClick_Server} />
    </>
  );
}

export default HomePage;
