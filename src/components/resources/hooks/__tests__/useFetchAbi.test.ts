import { getContractAbi } from '@app/utils/contracts';
import { renderHook, waitFor } from '@testing-library/react';
import { mockValidAddress } from '@tests/constants/data';
import { mainnet } from 'wagmi';
import { useFetchAbi } from '../useFetchAbi';

jest.mock('@app/utils/contracts');

describe('useFetchAbi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('no-op', () => {
    it('does nothing if address is invalid', () => {
      renderHook(() =>
        useFetchAbi({
          chainId: mainnet.id,
          address: '0x',
        })
      );
      expect(getContractAbi).not.toHaveBeenCalled();
    });

    it('does nothing if address is undefined', () => {
      renderHook(() =>
        useFetchAbi({
          chainId: mainnet.id,
          address: undefined,
        })
      );
      expect(getContractAbi).not.toHaveBeenCalled();
    });

    it('does nothing if chain id is undefined', () => {
      renderHook(() =>
        useFetchAbi({
          chainId: undefined,
          address: mockValidAddress,
        })
      );
      expect(getContractAbi).not.toHaveBeenCalled();
    });
  });

  describe('success', () => {
    const mockAbi = '[]';

    beforeEach(() => {
      (getContractAbi as jest.Mock).mockImplementation(() => mockAbi);
    });

    it('sets abi to fetched value', async () => {
      const { result } = renderHook(() =>
        useFetchAbi({
          chainId: mainnet.id,
          address: mockValidAddress,
        })
      );
      await waitFor(async () => {
        expect(result.current.abi).toEqual(JSON.stringify(mockAbi));
      });
    });

    it('sets error to undefined', async () => {
      const { result } = renderHook(() =>
        useFetchAbi({
          chainId: mainnet.id,
          address: mockValidAddress,
        })
      );
      await waitFor(async () => {
        expect(result.current.error).toBeUndefined();
      });
    });
  });

  describe('error', () => {
    const mockError = new Error('Error');

    beforeEach(() => {
      (getContractAbi as jest.Mock).mockImplementation(() => {
        throw mockError;
      });
    });

    it('sets abi to empty string', async () => {
      const { result } = renderHook(() =>
        useFetchAbi({
          chainId: mainnet.id,
          address: mockValidAddress,
        })
      );
      await waitFor(async () => {
        expect(result.current.abi).toEqual('');
      });
    });

    it('sets error to fetch abi error', async () => {
      const { result } = renderHook(() =>
        useFetchAbi({
          chainId: mainnet.id,
          address: mockValidAddress,
        })
      );
      await waitFor(async () => {
        expect(result.current.error).toEqual(mockError);
      });
    });
  });

  describe('loading', () => {
    beforeEach(() => {
      (getContractAbi as jest.Mock).mockImplementation(() => '');
    });

    it('sets isLoading to true and back to false', async () => {
      const { result } = renderHook(() =>
        useFetchAbi({
          chainId: mainnet.id,
          address: mockValidAddress,
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toEqual(true);
      });

      await waitFor(() => {
        expect(result.current.isLoading).toEqual(false);
      });
    });
  });
});
