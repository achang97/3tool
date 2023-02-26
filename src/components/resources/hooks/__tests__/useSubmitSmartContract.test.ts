import { ResourceType } from '@app/types';
import { renderHook } from '@testing-library/react';
import { mockValidAddresses } from '@tests/constants/data';
import { useSubmitSmartContract } from '../useSubmitSmartContract';

const mockHandleSubmit = jest.fn();

describe('useSubmitSmartContract', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validation', () => {
    it('does not call onSubmit if name is not supplied', async () => {
      const { result } = renderHook(() =>
        useSubmitSmartContract({
          name: '',
          smartContract: {
            chainId: 1,
            address: '',
            abi: '',
            logicAddress: '',
            logicAbi: '',
            isProxy: false,
          },
          onSubmit: mockHandleSubmit,
        })
      );
      result.current();
      expect(mockHandleSubmit).not.toHaveBeenCalled();
    });

    it('does not call onSubmit if address is invalid', async () => {
      const { result } = renderHook(() =>
        useSubmitSmartContract({
          name: 'New Contract',
          smartContract: {
            chainId: 1,
            address: 'Invalid Address',
            abi: '',
            logicAddress: '',
            logicAbi: '',
            isProxy: false,
          },
          onSubmit: mockHandleSubmit,
        })
      );
      result.current();
      expect(mockHandleSubmit).not.toHaveBeenCalled();
    });

    it('does not call onSubmit if ABI is invalid', async () => {
      const { result } = renderHook(() =>
        useSubmitSmartContract({
          name: 'New Contract',
          smartContract: {
            chainId: 1,
            address: mockValidAddresses[0],
            abi: 'Invalid JSON',
            logicAddress: '',
            logicAbi: '',
            isProxy: false,
          },
          onSubmit: mockHandleSubmit,
        })
      );
      result.current();
      expect(mockHandleSubmit).not.toHaveBeenCalled();
    });

    it('does not call onSubmit if logic address is invalid', async () => {
      const { result } = renderHook(() =>
        useSubmitSmartContract({
          name: 'New Contract',
          smartContract: {
            chainId: 1,
            address: mockValidAddresses[0],
            abi: '[]',
            logicAddress: 'Invalid Address',
            logicAbi: '',
            isProxy: true,
          },
          onSubmit: mockHandleSubmit,
        })
      );
      result.current();
      expect(mockHandleSubmit).not.toHaveBeenCalled();
    });

    it('does not call onSubmit if logic ABI is invalid', async () => {
      const { result } = renderHook(() =>
        useSubmitSmartContract({
          name: 'New Contract',
          smartContract: {
            chainId: 1,
            address: mockValidAddresses[0],
            abi: '[]',
            logicAddress: mockValidAddresses[1],
            logicAbi: 'Invalid JSON',
            isProxy: true,
          },
          onSubmit: mockHandleSubmit,
        })
      );
      result.current();
      expect(mockHandleSubmit).not.toHaveBeenCalled();
    });
  });

  describe('success', () => {
    it('calls onSubmit with logic contract information', async () => {
      const mockName = 'New Contract';
      const mockSmartContract = {
        chainId: 1,
        address: mockValidAddresses[0],
        abi: '["ABI"]',
        logicAddress: mockValidAddresses[1],
        logicAbi: '["Logic ABI"]',
        isProxy: true,
      };

      const { result } = renderHook(() =>
        useSubmitSmartContract({
          name: mockName,
          smartContract: mockSmartContract,
          onSubmit: mockHandleSubmit,
        })
      );
      result.current();
      expect(mockHandleSubmit).toHaveBeenCalledWith({
        type: ResourceType.SmartContract,
        name: mockName,
        data: {
          smartContract: mockSmartContract,
        },
      });
    });

    it('calls onSubmit without validating logic contract information', async () => {
      const mockName = 'New Contract';
      const mockSmartContract = {
        chainId: 1,
        address: mockValidAddresses[0],
        abi: '["ABI"]',
        logicAddress: 'Invalid Address',
        logicAbi: 'Invalid ABI',
        isProxy: false,
      };

      const { result } = renderHook(() =>
        useSubmitSmartContract({
          name: mockName,
          smartContract: mockSmartContract,
          onSubmit: mockHandleSubmit,
        })
      );
      result.current();
      expect(mockHandleSubmit).toHaveBeenCalledWith({
        type: ResourceType.SmartContract,
        name: mockName,
        data: {
          smartContract: {
            ...mockSmartContract,
            logicAddress: undefined,
            logicAbi: undefined,
          },
        },
      });
    });
  });
});
