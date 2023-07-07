import {
  DefaultService,
  apiHandler,
  common_HealthResponse,
  common_SumRequest,
  common_SumResponse,
} from '../../utils/apiHandler';

const handleCalculatorClick_Client = (a: number, b: number) => {
  return a + b;
};

const handleCalculatorClick_Server = (numbers: number[]) =>
  apiHandler<[common_SumRequest], common_SumResponse, number>(
    DefaultService.postCommonSum,
    [{ numbers }],
    {
      successCallback: (response: common_SumResponse) => {
        return response.result || 0;
      },
      errorCallback: e => {
        console.error(e);
        return 0;
      },
    }
  );

const pageLoad = () =>
  apiHandler<[], common_HealthResponse, string>(
    DefaultService.getCommonHealth,
    [],
    {
      successCallback: (response: common_HealthResponse) => {
        return response.status ? 'OK' : 'Not OK';
      },
      errorCallback: e => {
        console.error(e);
        return 'Not OK';
      },
    }
  );

const helper = {
  handleCalculatorClick_Client,
  handleCalculatorClick_Server,
  pageLoad,
};

export default helper;
