import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/client';
import { mocked } from 'ts-jest/utils';

import { SignInButton } from '.';

jest.mock('next-auth/client');

describe('SignInButton component', () => {
  it('renders correctly when user is not signed in', () => {
    const useSessionMock = mocked(useSession);

    useSessionMock.mockReturnValueOnce([null, false]);

    render(<SignInButton />);

    expect(screen.getByText('Sign in with GitHub')).toBeInTheDocument();
  });

  it('renders correctly when user is signed in', () => {
    const useSessionMock = mocked(useSession);

    useSessionMock.mockReturnValueOnce([
      {
        user: {
          name: 'User Full Name',
        },
      },
      true,
    ]);

    render(<SignInButton />);

    expect(screen.queryByText('Sign in with GitHub')).toBeNull();
    expect(screen.getByText('User Full Name')).toBeInTheDocument();
  });
});
