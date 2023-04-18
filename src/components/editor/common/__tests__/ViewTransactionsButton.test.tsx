import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ViewTransactionsButton } from '../ViewTransactionsButton';

describe('ViewTransactionsButton', () => {
  it('returns null if no urls are provided', () => {
    const result = render(<ViewTransactionsButton urls={[]} />);
    expect(result.container.firstChild).toBeNull();
  });

  describe('single url', () => {
    const mockUrls = ['https://google.com'];

    it('renders button to open url', async () => {
      render(<ViewTransactionsButton urls={mockUrls} />);
      await userEvent.click(screen.getByText('View transaction'));
      expect(window.open).toHaveBeenCalledWith(mockUrls[0]);
    });
  });

  describe('multiple urls', () => {
    const mockUrls = ['https://google.com/', 'https://yahoo.com/'];

    it('renders button to open menu with transaction options', async () => {
      render(<ViewTransactionsButton urls={mockUrls} />);
      await userEvent.click(screen.getByText('View transaction(s)'));

      const option1 = screen.getByTestId('view-transactions-menu-option-0');
      expect(option1).toHaveTextContent('Transaction 1');
      expect(option1).toHaveProperty('href', mockUrls[0]);
      expect(option1).toHaveProperty('target', '_blank');

      const option2 = screen.getByTestId('view-transactions-menu-option-1');
      expect(option2).toHaveTextContent('Transaction 2');
      expect(option2).toHaveProperty('href', mockUrls[1]);
      expect(option2).toHaveProperty('target', '_blank');
    });
  });
});
