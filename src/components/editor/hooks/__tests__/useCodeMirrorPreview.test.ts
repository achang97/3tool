import { renderHook } from '@tests/utils/renderWithContext';
import { useCodeMirrorPreview } from '../useCodeMirrorPreview';

describe('useCodeMirrorPreview', () => {
  it('returns null if isDynamic is false', () => {
    const { result } = renderHook(() =>
      useCodeMirrorPreview({
        type: 'string',
        isDynamic: false,
        expression: '{{ asdf }}',
      })
    );
    expect(result.current).toBeNull();
  });

  it('returns error object if eval returns error', () => {
    const { result } = renderHook(() =>
      useCodeMirrorPreview({
        type: 'string',
        isDynamic: true,
        expression: '{{ asdf }}',
      })
    );
    expect(result.current).toEqual({
      alertType: 'error',
      message: 'asdf is not defined',
    });
  });

  it('boolean: returns success object with parsedExpression and converted boolean', () => {
    const { result } = renderHook(() =>
      useCodeMirrorPreview({
        type: 'boolean',
        isDynamic: true,
        expression: 'random value',
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
      useCodeMirrorPreview({
        type: 'array',
        isDynamic: true,
        expression: '[1, 2, 3]',
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
      useCodeMirrorPreview({
        type: 'string',
        isDynamic: true,
        expression: 'hello',
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
      useCodeMirrorPreview({
        type: 'number',
        isDynamic: true,
        expression: '2',
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
      useCodeMirrorPreview({
        type: 'object',
        isDynamic: true,
        expression: '{ test: 1 }',
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
      useCodeMirrorPreview({
        type: 'any',
        isDynamic: true,
        expression: 'null',
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
      useCodeMirrorPreview({
        type: 'any',
        isDynamic: true,
        expression: 'undefined',
      })
    );
    expect(result.current).toEqual({
      type: 'undefined',
      alertType: 'success',
      message: undefined,
    });
  });
});
