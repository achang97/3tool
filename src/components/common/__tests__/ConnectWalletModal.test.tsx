import { render } from '@testing-library/react';
import { Web3Modal } from '@web3modal/react';
import { WALLETCONNECT_PROJECT_ID } from '@app/constants';
import { ethereumClient } from '@app/utils/wallet';
import { useTheme } from '@mui/material';
import { ConnectWalletModal } from '../ConnectWalletModal';

jest.mock('@web3modal/react', () => ({
  Web3Modal: jest.fn(),
}));

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useTheme: jest.fn(),
}));

describe('ConnectWalletModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockImplementation(() => ({
      palette: { primary: { main: '' } },
    }));
  });

  it('renders Web3Modal', () => {
    const mockWeb3Modal = 'Web3 Modal';
    (Web3Modal as unknown as jest.Mock).mockImplementation(() => mockWeb3Modal);
    const result = render(<ConnectWalletModal />);
    expect(result.getByText(mockWeb3Modal)).toBeTruthy();
  });

  it('passes project id to Web3Modal', () => {
    render(<ConnectWalletModal />);
    expect(Web3Modal).toHaveBeenCalledWith(
      expect.objectContaining({ projectId: WALLETCONNECT_PROJECT_ID }),
      {}
    );
  });

  it('passes ethereumClient to Web3Modal', () => {
    render(<ConnectWalletModal />);
    expect(Web3Modal).toHaveBeenCalledWith(
      expect.objectContaining({ ethereumClient }),
      {}
    );
  });

  it('passes theme variables to Web3Modal', () => {
    const mockPrimaryMainColor = 'blue';
    (useTheme as jest.Mock).mockImplementation(() => ({
      palette: {
        primary: {
          main: mockPrimaryMainColor,
        },
      },
    }));
    render(<ConnectWalletModal />);
    expect(Web3Modal).toHaveBeenCalledWith(
      expect.objectContaining({
        themeVariables: {
          '--w3m-font-family': 'Rubik',
          '--w3m-accent-color': mockPrimaryMainColor,
          '--w3m-background-color': mockPrimaryMainColor,
        },
      }),
      {}
    );
  });
});
