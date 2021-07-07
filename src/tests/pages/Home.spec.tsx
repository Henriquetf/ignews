import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import HomePage, { getStaticProps } from '../../pages';
import { stripe } from '../../services/stripe';

jest.mock('next/router');
jest.mock('next-auth/client', () => {
  return {
    useSession() {
      return [null, false];
    },
  };
});

jest.mock('next/image', () => {
  return () => <></>;
});

jest.mock('../../services/stripe');

describe('Home page', () => {
  it('renders correctly', () => {
    render(
      <HomePage
        product={{
          amount: 'R$10,00',
          priceId: 'fake-price-id',
        }}
      />,
    );

    expect(screen.getByText(/R\$10,00/i)).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    const retrievePricesStripeMock = mocked(stripe.prices.retrieve);

    retrievePricesStripeMock.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 5000,
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$50.00',
          },
        },
      }),
    );
  });
});
