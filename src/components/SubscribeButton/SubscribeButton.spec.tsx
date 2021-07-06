import { render, screen, fireEvent } from '@testing-library/react';
import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { mocked } from 'ts-jest/utils';
import { SubscribeButton } from '.';

jest.mock('next-auth/client');
jest.mock('next/router');

describe('SubscribeButton component', () => {
  it('renders correctly', () => {
    const useSessionMock = mocked(useSession);

    useSessionMock.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);

    expect(screen.getByText('Subscribe now')).toBeInTheDocument();
  });

  it('redirects user to sign in when not authenticated', () => {
    const signInMock = mocked(signIn);
    const useSessionMock = mocked(useSession);

    useSessionMock.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton);

    expect(signInMock).toHaveBeenCalled();
  });

  it('redirects to posts when user already has a subscription', () => {
    const useSessionMock = mocked(useSession);
    const useRouterMock = mocked(useRouter);
    const pushMock = jest.fn();

    useSessionMock.mockReturnValueOnce([
      {
        activeSubscription: true,
        user: {
          name: 'User Name',
          email: 'test@example.com',
        },
      },
      true,
    ]);
    useRouterMock.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalledWith('/posts');
  });
});
