import { renderHook } from '@testing-library/react';
import { useEvalArgs } from '../useEvalArgs';
import { useCodeMirrorEslintConfig } from '../useCodeMirrorEslintConfig';

jest.mock('../useEvalArgs');

describe('useCodeMirrorEslintConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns globals', () => {
    (useEvalArgs as jest.Mock).mockImplementation(() => ({
      staticEvalArgs: { action1: {} },
    }));
    const { result } = renderHook(() => useCodeMirrorEslintConfig());
    expect(result.current.globals).toEqual({
      action1: 'true',
    });
  });
});
