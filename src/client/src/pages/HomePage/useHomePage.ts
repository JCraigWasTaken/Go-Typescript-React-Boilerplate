import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';

import { apiHealthStatusAtom } from '../../state/atoms';
import helper from './homePageHelper';

export interface IUseHomePageProps {}

function useHomePage(props: IUseHomePageProps) {
  const { t } = useTranslation();
  // Props

  // State
  const [apiStatus, setApiStatus] = useRecoilState(apiHealthStatusAtom);

  // Callbacks

  const handleCalculatorClick_Client = useCallback(
    async (a: number, b: number) => {
      return helper.handleCalculatorClick_Client(a, b);
    },
    []
  );

  const handleCalculatorClick_Server = useCallback(
    async (a: number, b: number) => {
      return await helper.handleCalculatorClick_Server([a, b]);
    },
    []
  );

  // UseEffects
  useEffect(() => {
    // Page Load
    helper.pageLoad().then(apiStatus => {
      setApiStatus(apiStatus);
    });
  }, [setApiStatus]);

  // Return
  return {
    t,
    apiStatus,
    handleCalculatorClick_Client,
    handleCalculatorClick_Server,
  };
}

const Hook = {
  useHomePage,
};

export default Hook;
