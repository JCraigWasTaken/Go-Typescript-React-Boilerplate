// mocks/handlers.js
import { rest } from 'msw';
import { mockEndpointResponses, setMockUndefined } from './apiResponseDataMock';

export const successHandlers = [
  rest.get('/api/common/health', (_, res, ctx) => {
    try {
      return res(ctx.json(mockEndpointResponses['/api/common/health'].get));
    } catch (e) {
      return res(ctx.status(500));
    }
  }),

  rest.post('/api/common/sum', async (_, res, ctx) => {
    try {
      return res(ctx.json(mockEndpointResponses['/api/common/sum'].post));
    } catch (e) {
      return res(ctx.status(500));
    }
  }),
];

export const undefinedHandlers = [
  rest.get('/api/common/health', (_, res, ctx) => {
    return res(
      ctx.json(
        setMockUndefined(mockEndpointResponses['/api/common/health'].get)
      )
    );
  }),
  rest.post('/api/common/sum', async (_, res, ctx) => {
    return res(
      ctx.json(setMockUndefined(mockEndpointResponses['/api/common/sum'].post))
    );
  }),
];

export const errorHandlers_APIDisconnect = [
  rest.get('/api/common/health', (_, res, ctx) => {
    return res(ctx.status(504));
  }),
  rest.post('/api/common/sum', (_, res, ctx) => {
    return res(ctx.status(504));
  }),
];

export const errorHandlers_APIInternal = [
  rest.get('/api/common/health', (_, res, ctx) => {
    return res(ctx.json({ error: 'Error' }));
  }),
  rest.post('/api/common/sum', (_, res, ctx) => {
    return res(ctx.json({ error: 'Error' }));
  }),
];
