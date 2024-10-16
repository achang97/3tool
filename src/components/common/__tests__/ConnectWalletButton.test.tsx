import { screen, render } from '@testing-library/react';
import { Web3Button } from '@web3modal/react';
import { ConnectWalletButton } from '../ConnectWalletButton';

jest.mock('@web3modal/react', () => ({
  Web3Button: jest.fn(),
}));

describe('ConnectWalletButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Connect Wallet button', () => {
    const mockWeb3Button = 'Web3 Button';
    (Web3Button as jest.Mock).mockImplementation(() => mockWeb3Button);

    render(<ConnectWalletButton />);
    expect(screen.getByTestId('connect-wallet-button')).toBeTruthy();
    expect(screen.getByText(mockWeb3Button)).toBeTruthy();
  });
});
