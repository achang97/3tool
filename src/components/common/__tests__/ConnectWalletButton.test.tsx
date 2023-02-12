import { render } from '@testing-library/react';
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
    expect(result.getByText('Connect Wallet')).toBeTruthy();
  });

  it('opens WalletConnect modal on click', async () => {
    const result = render(<ConnectWalletButton />);
    await userEvent.click(result.getByText('Connect Wallet'));
    expect(mockOpen).toHaveBeenCalled();
  });
});
