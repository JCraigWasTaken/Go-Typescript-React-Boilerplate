import { Typography } from '@mui/material';
import Hook, { IUseErrorPageProps } from './useErrorPage';

export interface IErrorPageProps extends IUseErrorPageProps {}

function ErrorPage(props: IUseErrorPageProps) {
  const useErrorPageProps = {};
  const { t } = Hook.useErrorPage(useErrorPageProps);

  return (
    <>
      <Typography variant="h1" data-testid="errorMessage">
        {t('Pages:ErrorPage:Error')}
      </Typography>
    </>
  );
}

export default ErrorPage;
