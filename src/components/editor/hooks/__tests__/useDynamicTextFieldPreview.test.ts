import { renderHook } from '@testing-library/react';
import { useDynamicTextFieldPreview } from '../useDynamicTextFieldPreview';

describe('useDynamicTextFieldPreview', () => {
  it('returns error object if evalResult is empty', () => {
    const { result } = renderHook(() => useDynamicTextFieldPreview({}));
    expect(result.current).toEqual({
      alertType: 'error',
      message:
        'Failed evaluation: please check that you have resolved all dependency cycles.',
    });
  });

  it('returns error object if error is defined', () => {
    const mockError = 'Error message';
    const { result } = renderHook(() =>
      useDynamicTextFieldPreview({ error: new Error(mockError) })
    );
    expect(result.current).toEqual({
      alertType: 'error',
      message: mockError,
    });
  });

  it('boolean: returns success object with parsedExpression and converted boolean', () => {
    const { result } = renderHook(() =>
      useDynamicTextFieldPreview({
        parsedExpression: 'random value',
        value: true,
      })
    );
    expect(result.current).toEqual({
      type: 'boolean',
      alertType: 'success',
      message: '"random value" → true',
    });
  });

  it('array: returns success object with array length', () => {
    const { result } = renderHook(() =>
      useDynamicTextFieldPreview({
        value: [1, 2, 3],
      })
    );
    expect(result.current).toEqual({
      type: 'array (3)',
      alertType: 'success',
      message: '[1,2,3]',
    });
  });

  it('string: returns success object with stringified value', () => {
    const { result } = renderHook(() =>
      useDynamicTextFieldPreview({
        value: 'hello',
      })
    );
    expect(result.current).toEqual({
      type: 'string',
      alertType: 'success',
      message: '"hello"',
    });
  });

  it('number: returns success object with stringified value', () => {
    const { result } = renderHook(() =>
      useDynamicTextFieldPreview({
        value: 2,
      })
    );
    expect(result.current).toEqual({
      type: 'number',
      alertType: 'success',
      message: '2',
    });
  });

  it('object: returns success object with stringified value', () => {
    const { result } = renderHook(() =>
      useDynamicTextFieldPreview({
        value: { test: 1 },
      })
    );
    expect(result.current).toEqual({
      type: 'object',
      alertType: 'success',
      message: '{"test":1}',
    });
  });

  it('null: returns success object with stringified value', () => {
    const { result } = renderHook(() =>
      useDynamicTextFieldPreview({
        value: null,
      })
    );
    expect(result.current).toEqual({
      type: 'null',
      alertType: 'success',
      message: null,
    });
  });

  it('undefined: returns success object with stringified value', () => {
    const { result } = renderHook(() =>
      useDynamicTextFieldPreview({
        value: undefined,
      })
    );
    expect(result.current).toEqual({
      type: 'undefined',
      alertType: 'success',
      message: undefined,
    });
  });
});
