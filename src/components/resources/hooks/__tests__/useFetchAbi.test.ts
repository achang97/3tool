import { getContractAbi } from '@app/utils/contracts';
import { renderHook, waitFor } from '@testing-library/react';
import { mainnet } from 'wagmi';
import { useFetchAbi } from '../useFetchAbi';

jest.mock('@app/utils/contracts');

const mockHandleAbiChange = jest.fn();
const mockAddress = '0xf33Cb58287017175CADf990c9e4733823704aA86';
const mockChainId = mainnet.id;

describe('useFetchAbi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('no-op', () => {
    it('does nothing if address is invalid', () => {
      renderHook(() =>
        useFetchAbi({
          abi: '',
          chainId: mockChainId,
          address: '0x',
          onAbiChange: mockHandleAbiChange,
        })
      );

      expect(getContractAbi).not.toHaveBeenCalled();
    });

    it('does nothing if abi changes to the empty string', () => {
      const { rerender } = renderHook(() =>
        useFetchAbi({
          abi: '[]',
          chainId: mockChainId,
          address: mockAddress,
          onAbiChange: mockHandleAbiChange,
        })
      );

      rerender({
        abi: '',
        chainId: mockChainId,
        address: mockAddress,
        onAbiChange: mockHandleAbiChange,
      });

      expect(getContractAbi).not.toHaveBeenCalled();
    });

    it('does nothing if abi is defined', () => {
      renderHook(() =>
        useFetchAbi({
          abi: '[]',
          chainId: mockChainId,
          address: mockAddress,
          onAbiChange: mockHandleAbiChange,
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

    it('calls onAbiChange with fetched abi', async () => {
      renderHook(() =>
        useFetchAbi({
          abi: '',
          chainId: mainnet.id,
          address: mockAddress,
          onAbiChange: mockHandleAbiChange,
        })
      );

      await waitFor(() => {
        expect(mockHandleAbiChange).toHaveBeenCalledWith(
          JSON.stringify(mockAbi, null, 2)
        );
      });
    });

    it('sets error to empty string', async () => {
      const { result } = renderHook(() =>
        useFetchAbi({
          abi: '',
          chainId: mainnet.id,
          address: mockAddress,
          onAbiChange: mockHandleAbiChange,
        })
      );

      await waitFor(() => {
        expect(mockHandleAbiChange).toHaveBeenCalled();
        expect(result.current.error).toEqual('');
      });
    });
  });

  describe('error', () => {
    const mockError = 'Error';

    beforeEach(() => {
      (getContractAbi as jest.Mock).mockImplementation(() => {
        throw new Error(mockError);
      });
    });

    it('calls onAbiChange with empty string', async () => {
      renderHook(() =>
        useFetchAbi({
          abi: '',
          chainId: mainnet.id,
          address: mockAddress,
          onAbiChange: mockHandleAbiChange,
        })
      );

      await waitFor(() => {
        expect(mockHandleAbiChange).toHaveBeenCalledWith('');
      });
    });

    it('sets error to fetch abi error message', async () => {
      const { result } = renderHook(() =>
        useFetchAbi({
          abi: '',
          chainId: mainnet.id,
          address: mockAddress,
          onAbiChange: mockHandleAbiChange,
        })
      );

      await waitFor(() => {
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
          abi: '',
          chainId: mainnet.id,
          address: mockAddress,
          onAbiChange: mockHandleAbiChange,
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
