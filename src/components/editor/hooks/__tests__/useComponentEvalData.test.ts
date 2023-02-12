import { ComponentType } from '@app/types';
import { renderHook } from '@testing-library/react';
import { useComponentEvalData } from '../useComponentEvalData';

jest.mock('../useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    componentEvalDataMap: {
      button1: {
        text: {
          value: 'hello',
        },
      },
    },
    componentEvalDataValuesMap: {
      button1: {
        text: 'hello',
      },
    },
  })),
}));

describe('useComponentEvalData', () => {
  describe('evalData', () => {
    it('returns empty object if component name is invalid', () => {
      const { result } = renderHook(() =>
        useComponentEvalData<ComponentType.Button>('invalid-component-name')
      );
      expect(result.current.evalData).toEqual({});
    });

    it('returns EvalData object if component name is valid', () => {
      const { result } = renderHook(() =>
        useComponentEvalData<ComponentType.Button>('button1')
      );
      expect(result.current.evalData).toEqual({
        text: {
          value: 'hello',
        },
      });
    });
  });

  describe('evalDataValues', () => {
    it('returns empty object if component name is invalid', () => {
      const { result } = renderHook(() =>
        useComponentEvalData<ComponentType.Button>('invalid-component-name')
      );
      expect(result.current.evalDataValues).toEqual({});
    });

    it('returns EvalDataValues if component name is valid', () => {
      const { result } = renderHook(() =>
        useComponentEvalData<ComponentType.Button>('button1')
      );
      expect(result.current.evalDataValues).toEqual({
        text: 'hello',
      });
    });
  });
});
