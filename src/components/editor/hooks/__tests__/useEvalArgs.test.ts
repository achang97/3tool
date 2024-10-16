import { renderHook } from '@testing-library/react';
import { mockTool } from '@tests/constants/data';
import { utils } from '../../utils/public';
import { useActionMethods } from '../useActionMethods';
import { useActiveTool } from '../useActiveTool';
import { useBaseEvalArgs } from '../useBaseEvalArgs';
import { useEvalArgs } from '../useEvalArgs';
import { useLocalEvalArgs } from '../useLocalEvalArgs';

jest.mock('../useActiveTool');
jest.mock('../useBaseEvalArgs');
jest.mock('../useLocalEvalArgs');
jest.mock('../useActionMethods');

describe('useEvalArgs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: mockTool,
      evalDataValuesMap: {},
    }));
    (useBaseEvalArgs as jest.Mock).mockImplementation(() => ({}));
    (useLocalEvalArgs as jest.Mock).mockImplementation(() => ({}));
  });

  describe('general', () => {
    it('includes entries from base eval args', () => {
      const mockBaseEvalArgs = {
        action1: {
          data: 'hello',
        },
      };
      (useBaseEvalArgs as jest.Mock).mockImplementation(() => mockBaseEvalArgs);

      const { result } = renderHook(() => useEvalArgs());
      expect(result.current.dynamicEvalArgs).toMatchObject(mockBaseEvalArgs);
      expect(result.current.staticEvalArgs).toMatchObject(mockBaseEvalArgs);
    });

    it('includes entries from evaluated component data', () => {
      const mockElementEvalDataValuesMap = {
        button1: {
          text: 'hello',
        },
      };
      (useActiveTool as jest.Mock).mockImplementation(() => ({
        tool: mockTool,
        evalDataValuesMap: mockElementEvalDataValuesMap,
      }));

      const { result } = renderHook(() => useEvalArgs());
      expect(result.current.dynamicEvalArgs).toMatchObject(mockElementEvalDataValuesMap);
      expect(result.current.staticEvalArgs).toMatchObject(mockElementEvalDataValuesMap);
    });

    it('overrides base args with local eval args', () => {
      const mockLocalEvalArgs = {
        action1: 'newData',
      };
      (useBaseEvalArgs as jest.Mock).mockImplementation(() => ({
        action1: {
          data: 'hello',
        },
      }));
      (useLocalEvalArgs as jest.Mock).mockImplementation(() => ({ args: mockLocalEvalArgs }));

      const { result } = renderHook(() => useEvalArgs());
      expect(result.current.dynamicEvalArgs).toMatchObject(mockLocalEvalArgs);
      expect(result.current.staticEvalArgs).toMatchObject(mockLocalEvalArgs);
    });
  });

  describe('static', () => {
    it('includes entries from action functions', () => {
      const mockActionMethods = {
        action1: {
          trigger: () => {},
        },
      };
      (useActionMethods as jest.Mock).mockImplementation(() => mockActionMethods);

      const { result } = renderHook(() => useEvalArgs());
      expect(result.current.staticEvalArgs).toMatchObject(mockActionMethods);
    });

    it('includes entries from utils', () => {
      const { result } = renderHook(() => useEvalArgs());
      expect(result.current.staticEvalArgs).toMatchObject({ utils });
    });
  });

  describe('dynamic', () => {
    it('does not include entries from action functions', () => {
      const mockActionMethods = {
        action1: {
          trigger: () => {},
        },
      };
      (useActionMethods as jest.Mock).mockImplementation(() => mockActionMethods);

      const { result } = renderHook(() => useEvalArgs());
      expect(result.current.dynamicEvalArgs).not.toMatchObject(mockActionMethods);
    });

    it('does not include entries from utils', () => {
      const { result } = renderHook(() => useEvalArgs());
      expect(result.current.dynamicEvalArgs).not.toMatchObject({ utils });
    });
  });
});
