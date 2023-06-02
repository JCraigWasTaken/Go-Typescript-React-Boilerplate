// HomeContainer.test.tsx

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { RecoilRoot } from 'recoil';

import HomeContainer from './HomeContainer';

const server = setupServer(
  rest.get('/api/health', (req, res, ctx) => {
    return res(ctx.json({ status: 'OK' }));
  }),

  rest.post('/api/math/sum', async (req, res, ctx) => {
    const numbers = (await req.json()).numbers;
    const sum = numbers.reduce((a: number, b: number) => a + b, 0);
    return res(ctx.json({ result: sum }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders HomeContainer and check good API calls', async () => {
  render(
    <RecoilRoot>
      <HomeContainer />
    </RecoilRoot>
  );

  await screen.findByText(/Pages:HomePage:OK/i);

  const homeElement = screen.getByText(/Pages:HomePage:Home/i);
  expect(homeElement).toBeInTheDocument();

  const calculatorClientElement = screen.getByText(
    /Pages:HomePage:Client Calculator/i
  );
  const calculatorServerElement = screen.getByText(
    /Pages:HomePage:Server Calculator/i
  );
  expect(calculatorClientElement).toBeInTheDocument();
  expect(calculatorServerElement).toBeInTheDocument();

  // Assuming there are inputs with 'number-input' role
  const valueAInputs = screen.getAllByTestId('valueA-input');
  const valueBInputs = screen.getAllByTestId('valueB-input');
  const calculateButtons = screen.getAllByTestId('calculate-button');
  const valueTypography = screen.getAllByTestId('result-value');

  fireEvent.change(valueAInputs[0], { target: { value: '2' } });
  fireEvent.change(valueBInputs[0], { target: { value: '3' } });

  fireEvent.click(calculateButtons[0]); // client side calculation
  await waitFor(() => expect(valueTypography[0]).toHaveTextContent('5'));

  fireEvent.change(valueAInputs[1], { target: { value: '2' } });
  fireEvent.change(valueBInputs[1], { target: { value: '3' } });

  fireEvent.click(calculateButtons[1]); // server side calculation
  await waitFor(() => expect(valueTypography[1]).toHaveTextContent('5'));
});

test('renders HomeContainer and check undefined API calls', async () => {
  server.use(
    rest.get('/api/health', (req, res, ctx) => {
      return res(ctx.json({ status: undefined }));
    }),
    rest.post('/api/math/sum', async (req, res, ctx) => {
      return res(ctx.json({ result: undefined }));
    })
  );

  render(
    <RecoilRoot>
      <HomeContainer />
    </RecoilRoot>
  );

  await screen.findByText(/Pages:HomePage:Not OK/i);

  const valueAInputs = screen.getAllByTestId('valueA-input');
  const valueBInputs = screen.getAllByTestId('valueB-input');
  const calculateButtons = screen.getAllByTestId('calculate-button');
  const valueTypography = screen.getAllByTestId('result-value');

  fireEvent.change(valueAInputs[1], { target: { value: '2' } });
  fireEvent.change(valueBInputs[1], { target: { value: '3' } });

  fireEvent.click(calculateButtons[1]); // server side calculation
  await waitFor(() =>
    expect(valueTypography[1]).toHaveTextContent(String(NaN))
  );
});

test('renders HomeContainer and check error API calls', async () => {
  server.use(
    rest.get('/api/health', (req, res, ctx) => {
      return res(ctx.status(500));
    }),
    rest.post('/api/math/sum', async (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  render(
    <RecoilRoot>
      <HomeContainer />
    </RecoilRoot>
  );

  await screen.findByText(/Pages:HomePage:Not OK/i);

  const valueAInputs = screen.getAllByTestId('valueA-input');
  const valueBInputs = screen.getAllByTestId('valueB-input');
  const calculateButtons = screen.getAllByTestId('calculate-button');
  const valueTypography = screen.getAllByTestId('result-value');

  fireEvent.change(valueAInputs[1], { target: { value: '2' } });
  fireEvent.change(valueBInputs[1], { target: { value: '3' } });

  fireEvent.click(calculateButtons[1]); // server side calculation
  await waitFor(() =>
    expect(valueTypography[1]).toHaveTextContent(String(NaN))
  );
});
