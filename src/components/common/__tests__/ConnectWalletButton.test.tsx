import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConnectWalletButton } from '../ConnectWalletButton';

const mockOpen = jest.fn();

jest.mock('@web3modal/react', () => ({
  useWeb3Modal: jest.fn(() => ({
    open: mockOpen,
  })),
}));

describe('ConnectWalletButton', () => {
  it('renders Connect Wallet text', () => {
    const result = render(<ConnectWalletButton />);
    expect(result.getByText('Connect Wallet')).toBeDefined();
  });

  it('opens WalletConnect modal on click', async () => {
    const result = render(<ConnectWalletButton />);
    userEvent.click(result.getByText('Connect Wallet'));
    await waitFor(() => {
      expect(mockOpen).toHaveBeenCalled();
    });
  });
});
