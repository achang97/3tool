import { renderHook } from '@testing-library/react';
import { useComponentInputs } from '../useComponentInputs';

jest.mock('@app/redux/hooks', () => ({
  useAppSelector: jest.fn(() => ({
    componentInputs: {
      textInput1: {
        value: 'hello',
      },
    },
  })),
}));

describe('useComponentInputs', () => {
  it('returns empty object if component name is invalid', () => {
    const { result } = renderHook(() =>
      useComponentInputs('invalid-component-name')
    );
    expect(result.current).toEqual({});
  });

  it('returns object from inputs if component name is valid', () => {
    const { result } = renderHook(() => useComponentInputs('textInput1'));
    expect(result.current).toEqual({
      value: 'hello',
    });
  });
});
