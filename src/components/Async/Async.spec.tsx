import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { Async } from '.';

describe('Async component', () => {
  it('visible button appears findByText', async () => {
    render(<Async />);

    expect(screen.getByText('world Hello')).toBeInTheDocument();
    expect(await screen.findByText('Button')).toBeInTheDocument();
  });

  it('visible button appears waitFor', async () => {
    render(<Async />);

    await waitFor(() => expect(screen.getByText('Button')).toBeInTheDocument());
  });

  it('invisible button disappears waitFor', async () => {
    render(<Async />);

    const button = screen.queryByText('Invisible');

    await waitForElementToBeRemoved(button);
    await expect(button).not.toBeInTheDocument();
  });

  it('invisible button disappears waitFor', async () => {
    render(<Async />);

    const button = screen.queryByText('Invisible');

    await waitFor(() => expect(button).not.toBeInTheDocument());
  });
});
