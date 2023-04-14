import { renderHook } from '@testing-library/react';
import { useEvalArgs } from '../useEvalArgs';
import { useEvalDynamicValue } from '../useEvalDynamicValue';

jest.mock('../useEvalArgs');
describe('useEvalDynamicValue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useEvalArgs as jest.Mock).mockImplementation(() => ({}));
  });

  it('evaluates dynamic expression with dynamic args', () => {
    (useEvalArgs as jest.Mock).mockImplementation(() => ({
      dynamicEvalArgs: { text: 'world' },
    }));

    const { result } = renderHook(() => useEvalDynamicValue());
    expect(result.current('hello {{ text }}', 'string')).toEqual('hello world');
  });

  it('evaluates dynamic expression with locally specified args', () => {
    (useEvalArgs as jest.Mock).mockImplementation(() => ({
      dynamicEvalArgs: { text: 'world' },
    }));

    const { result } = renderHook(() => useEvalDynamicValue());
    expect(result.current('hello {{ text }}', 'string', { text: 'new world' })).toEqual(
      'hello new world'
    );
  });

  it('returns undefined if error', () => {
    const { result } = renderHook(() => useEvalDynamicValue());
    expect(result.current('{{ a }}', 'string')).toBeUndefined();
  });
});
