import { render, screen } from '@testing-library/react';
import { ActiveLink } from '.';

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/home',
      };
    },
  };
});

describe('ActiveLink component', () => {
  it('renders correctly', () => {
    render(
      <ActiveLink href="/home" activeClassName="active">
        <a>Home</a>
      </ActiveLink>,
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('should pass activeClassName to the child element if path matches', () => {
    render(
      <ActiveLink href="/home" activeClassName="active">
        <a>Home</a>
      </ActiveLink>,
    );

    expect(screen.getByText('Home')).toHaveClass('active');
  });

  it('should not pass activeClassName to the child element if path does not match', () => {
    render(
      <ActiveLink href="/wrong-link" activeClassName="active">
        <a>Home</a>
      </ActiveLink>,
    );

    expect(screen.getByText('Home')).not.toHaveClass('active');
  });
});
