import { renderHook } from '@testing-library/react';
import { useActionJavascriptExecute } from '../useActionJavascriptExecute';
import { useEvalArgs } from '../useEvalArgs';

jest.mock('../useEvalArgs', () => ({
  useEvalArgs: jest.fn(),
}));

describe('useActionJavascriptExecute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('executes code with static eval args', async () => {
    (useEvalArgs as jest.Mock).mockImplementation(() => ({
      staticEvalArgs: { text: 'world' },
    }));
    const { result } = renderHook(() => useActionJavascriptExecute());
    // eslint-disable-next-line no-template-curly-in-string
    expect(await result.current('return `hello ${text}`')).toEqual('hello world');
  });

  it('executes code with local eval args', async () => {
    (useEvalArgs as jest.Mock).mockImplementation(() => ({
      staticEvalArgs: { text: 'world' },
    }));
    const { result } = renderHook(() => useActionJavascriptExecute());
    expect(
      // eslint-disable-next-line no-template-curly-in-string
      await result.current('return `hello ${text}`', { text: 'new world' })
    ).toEqual('hello new world');
  });
});
