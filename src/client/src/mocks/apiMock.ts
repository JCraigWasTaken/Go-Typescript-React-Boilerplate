// mocks/handlers.js
import { http } from 'msw';
import { mockEndpointResponses, setMockUndefined } from './apiResponseDataMock';

export const successHandlers = [
  http.get('/api/common/health', (_, res) => {
    try {
      return res.json(mockEndpointResponses['/api/common/health'].get);
    } catch (e) {
      return res.status(500);
    }
  }),

  http.post('/api/common/sum', async (_, res) => {
    try {
      return res.json(mockEndpointResponses['/api/common/sum'].post);
    } catch (e) {
      return res.status(500);
    }
  }),
];

export const undefinedHandlers = [
  http.get('/api/common/health', (_, res) => {
    return res.json(
      setMockUndefined(mockEndpointResponses['/api/common/health'].get)
    );
  }),
  http.post('/api/common/sum', async (_, res) => {
    return res.json(
      setMockUndefined(mockEndpointResponses['/api/common/sum'].post)
    );
  }),
];

export const errorHandlers_APIDisconnect = [
  http.get('/api/common/health', (_, res) => {
    return res.status(504);
  }),
  http.post('/api/common/sum', (_, res) => {
    return res.status(504);
  }),
];

export const errorHandlers_APIInternal = [
  http.get('/api/common/health', (_, res) => {
    return res.json({ error: 'Error' });
  }),
  http.post('/api/common/sum', (_, res) => {
    return res.json({ error: 'Error' });
  }),
];
