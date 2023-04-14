import { renderHook } from '@testing-library/react';
import { SMART_CONTRACT_BASE_DATA_FUNCTION_TEMPLATE } from '@app/constants';
import { SmartContractBaseData } from '@app/types';
import { useActionSmartContractUpdate } from '../useActionSmartContractUpdate';

describe('useActionSmartContractUpdate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('unchanged ABI', () => {
    it('returns original update if ABI has not changed', () => {
      const { result } = renderHook(() =>
        useActionSmartContractUpdate({
          data: { functions: [{ name: 'function1' }] } as SmartContractBaseData,
        })
      );
      const mockUpdate = {};
      expect(result.current(mockUpdate)).toEqual({
        update: mockUpdate,
        hasResetFunctions: false,
      });
    });

    it('returns original update if there is no function data ', () => {
      const { result } = renderHook(() =>
        useActionSmartContractUpdate({
          data: {
            functions: [SMART_CONTRACT_BASE_DATA_FUNCTION_TEMPLATE],
          } as SmartContractBaseData,
        })
      );
      const mockUpdate = { freeform: true };
      expect(result.current(mockUpdate)).toEqual({
        update: mockUpdate,
        hasResetFunctions: false,
      });
    });
  });

  describe('changed ABI with user cancelation', () => {
    it('returns undefined update if user cancels', () => {
      (window.confirm as jest.Mock).mockImplementation(() => false);
      const { result } = renderHook(() =>
        useActionSmartContractUpdate({
          data: { functions: [{ name: 'function1' }] } as SmartContractBaseData,
        })
      );
      const mockUpdate = { freeform: true };
      expect(result.current(mockUpdate)).toEqual({
        update: undefined,
        hasResetFunctions: false,
      });
    });
  });

  describe('changed ABI with user confirmation', () => {
    it('returns extended freeform update', () => {
      (window.confirm as jest.Mock).mockImplementation(() => true);
      const { result } = renderHook(() =>
        useActionSmartContractUpdate({
          data: { functions: [{ name: 'function1' }] } as SmartContractBaseData,
        })
      );
      const mockUpdate = { freeform: true };
      expect(result.current(mockUpdate)).toEqual({
        update: {
          ...mockUpdate,
          functions: [SMART_CONTRACT_BASE_DATA_FUNCTION_TEMPLATE],
        },
        hasResetFunctions: true,
      });
    });

    it('returns extended freeform ABI id update', () => {
      (window.confirm as jest.Mock).mockImplementation(() => true);
      const { result } = renderHook(() =>
        useActionSmartContractUpdate({
          data: { functions: [{ name: 'function1' }] } as SmartContractBaseData,
        })
      );
      const mockUpdate = { freeformAbiId: '1' };
      expect(result.current(mockUpdate)).toEqual({
        update: {
          ...mockUpdate,
          functions: [SMART_CONTRACT_BASE_DATA_FUNCTION_TEMPLATE],
        },
        hasResetFunctions: true,
      });
    });

    it('returns extended smart contract id update', () => {
      (window.confirm as jest.Mock).mockImplementation(() => true);
      const { result } = renderHook(() =>
        useActionSmartContractUpdate({
          data: { functions: [{ name: 'function1' }] } as SmartContractBaseData,
        })
      );
      const mockUpdate = { smartContractId: '1' };
      expect(result.current(mockUpdate)).toEqual({
        update: {
          ...mockUpdate,
          functions: [SMART_CONTRACT_BASE_DATA_FUNCTION_TEMPLATE],
        },
        hasResetFunctions: true,
      });
    });
  });
});
