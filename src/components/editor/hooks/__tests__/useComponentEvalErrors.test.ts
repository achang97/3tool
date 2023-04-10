import { Component, ComponentEvent, ComponentType, EventHandlerType } from '@app/types';
import { renderHook } from '@testing-library/react';
import { useComponentEvalData } from '../useComponentEvalData';
import { useComponentEvalErrors } from '../useComponentEvalErrors';

const mockComponent = {
  name: 'table1',
  type: ComponentType.Table,
  data: {
    table: {
      data: '[]',
      columnHeaderNames: {
        id: 'hello',
      },
      columnHeadersByIndex: ['hello'],
    },
  },
  eventHandlers: [
    {
      event: ComponentEvent.Click,
      type: EventHandlerType.Action,
      data: {
        action: {
          actionName: 'actionName',
        },
      },
    },
  ],
} as unknown as Component;
const mockError = new Error('Error message');

jest.mock('../useComponentEvalData');

describe('useComponentEvalErrors', () => {
  it('returns empty array if there are no errors', () => {
    (useComponentEvalData as jest.Mock).mockImplementation(() => ({
      evalData: {
        data: { parsedExpression: '[]', value: [] },
        columnHeaderNames: {
          id: { parsedExpression: 'hello', value: 'hello' },
        },
      },
    }));

    const { result } = renderHook(() => useComponentEvalErrors(mockComponent));
    expect(result.current).toEqual([]);
  });

  describe('data', () => {
    it('returns array with root-level data field error', () => {
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalData: {
          data: { error: mockError },
        },
      }));

      const { result } = renderHook(() => useComponentEvalErrors(mockComponent));
      expect(result.current).toEqual([{ name: 'data', error: mockError }]);
    });

    it('returns array with nested object data field error', () => {
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalData: {
          columnHeaderNames: {
            id: { error: mockError },
          },
        },
      }));

      const { result } = renderHook(() => useComponentEvalErrors(mockComponent));
      expect(result.current).toEqual([{ name: 'columnHeaderNames.id', error: mockError }]);
    });

    it('returns array with nested array data field error', () => {
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalData: {
          columnHeadersByIndex: [{ error: mockError }],
        },
      }));

      const { result } = renderHook(() => useComponentEvalErrors(mockComponent));
      expect(result.current).toEqual([{ name: 'columnHeadersByIndex[0]', error: mockError }]);
    });
  });

  describe('event handler', () => {
    it('returns array with event handler error', () => {
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalData: {
          'eventHandlers[0].actionName': { error: mockError },
        },
      }));

      const { result } = renderHook(() => useComponentEvalErrors(mockComponent));
      expect(result.current).toEqual([{ name: 'eventHandlers[0].actionName', error: mockError }]);
    });
  });
});
