// mocks/handlers.js
import { http, HttpResponse } from 'msw';
import { mockEndpointResponses, setMockUndefined } from './apiResponseDataMock';

export const successHandlers = [
  http.get('/api/common/health', () => {
    try {
      return HttpResponse.json(mockEndpointResponses['/api/common/health'].get);
    } catch (e) {
      return new HttpResponse(null, { status: 500 });
    }
  }),

  http.post('/api/common/sum', async () => {
    try {
      return HttpResponse.json(mockEndpointResponses['/api/common/sum'].post);
    } catch (e) {
      return new HttpResponse(null, { status: 500 });
    }
  }),
];

export const undefinedHandlers = [
  http.get('/api/common/health', () => {
    return HttpResponse.json(
      setMockUndefined(mockEndpointResponses['/api/common/health'].get)
    );
  }),
  http.post('/api/common/sum', async () => {
    return HttpResponse.json(
      setMockUndefined(mockEndpointResponses['/api/common/sum'].post)
    );
  }),
];

export const errorHandlers_APIDisconnect = [
  http.get('/api/common/health', () => {
    return new HttpResponse(null, { status: 504 });
  }),
  http.post('/api/common/sum', () => {
    return new HttpResponse(null, { status: 504 });
  }),
];

export const errorHandlers_APIInternal = [
  http.get('/api/common/health', () => {
    return HttpResponse.json({ error: 'Error' });
  }),
  http.post('/api/common/sum', () => {
    return HttpResponse.json({ error: 'Error' });
  }),
];
