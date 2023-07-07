// mocks/handlers.js
import { rest } from 'msw';
import {
  mock_endpointsCommon_HealthResponse,
  mock_endpointsCommon_SumResponse,
  setMockUndefined,
} from './apiResponseDataMock';

export const successHandlers = [
  rest.get('/api/common/health', (_, res, ctx) => {
    try {
      return res(ctx.json(mock_endpointsCommon_HealthResponse));
    } catch (e) {
      return res(ctx.status(500));
    }
  }),

  rest.post('/api/common/sum', async (_, res, ctx) => {
    try {
      return res(ctx.json(mock_endpointsCommon_SumResponse));
    } catch (e) {
      return res(ctx.status(500));
    }
  }),
];

export const undefinedHandlers = [
  rest.get('/api/common/health', (_, res, ctx) => {
    return res(ctx.json(setMockUndefined(mock_endpointsCommon_HealthResponse)));
  }),
  rest.post('/api/common/sum', async (_, res, ctx) => {
    return res(ctx.json(setMockUndefined(mock_endpointsCommon_SumResponse)));
  }),
];

export const errorHandlers = [
  rest.get('/api/common/health', (_, res, ctx) => {
    return res(ctx.status(500));
  }),
  rest.post('/api/common/sum', (_, res, ctx) => {
    return res(ctx.status(500));
  }),
];
