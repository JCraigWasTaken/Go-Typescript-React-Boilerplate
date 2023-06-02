import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';

import HomeComponent from './HomeComponent';
import { apiHealthStatusAtom } from '../../state/atoms';
import {
  apiHandler,
  endpoints_HealthResponse,
  DefaultService,
  endpoints_SumResponse,
} from '../../utils/apiHandler';

function HomeContainer() {
  const [apiStatus, setApiStatus] = useRecoilState(apiHealthStatusAtom);
  const [clientCalcResult, setClientCalcResult] = useState<number>(0);
  const [serverCalcResult, setServerCalcResult] = useState<number>(0);

  const { t } = useTranslation();

  useEffect(() => {
    // React-strict-mode is enabled by default in CRA and it will double render in development mode. This means that the API calls will be made twice.
    const apiCalls = () => {
      apiHandler(
        DefaultService.getHealth,
        {},
        {
          successCallback: (response: endpoints_HealthResponse) => {
            setApiStatus(
              response.status
                ? (t('Pages:HomePage:OK') as string)
                : (t('Pages:HomePage:Not OK') as string)
            );
          },
          errorCallback: () => {
            setApiStatus(t('Pages:HomePage:Not OK') as string);
          },
        }
      );
    };
    apiCalls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClientCalcClick = (a: number, b: number) => {
    setClientCalcResult(a + b);
  };

  const onServerCalcClick = (a: number, b: number) => {
    apiHandler(
      DefaultService.postMathSum,
      { numbers: [a, b] },
      {
        successCallback: (response: endpoints_SumResponse) => {
          setServerCalcResult(response.result || NaN);
        },
        errorCallback: () => {
          setServerCalcResult(NaN);
        },
      }
    );
  };

  return (
    <HomeComponent
      apiStatus={apiStatus}
      clientCalcResult={clientCalcResult}
      serverCalcResult={serverCalcResult}
      onClientCalcClick={onClientCalcClick}
      onServerCalcClick={onServerCalcClick}
    />
  );
}

export default HomeContainer;
