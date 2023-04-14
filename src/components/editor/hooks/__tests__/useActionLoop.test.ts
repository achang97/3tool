import { renderHook } from '@tests/utils/renderWithContext';
import { useActionLoop } from '../useActionLoop';

const mockElementCallback = jest.fn();

describe('useActionLoop', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls element callback without arguments if loop is not enabled', async () => {
    mockElementCallback.mockImplementation((element) => element);

    const { result } = renderHook(() => useActionLoop());
    const loopResult = await result.current(
      {
        loopEnabled: false,
        loopElements: 'return [1, 2];',
      },
      mockElementCallback
    );
    expect(mockElementCallback).toHaveBeenCalledWith();
    expect(loopResult).toEqual(undefined);
  });

  it('throws error if code does not evaluate to array', async () => {
    mockElementCallback.mockImplementation((element) => element);

    const { result } = renderHook(() => useActionLoop());
    expect(() =>
      result.current(
        {
          loopEnabled: true,
          loopElements: 'return 1',
        },
        mockElementCallback
      )
    ).rejects.toThrowError('Loop code did not return a valid array.');
  });

  it('returns array of elements and result data', async () => {
    mockElementCallback.mockImplementation((element) => element + 1);

    const { result } = renderHook(() => useActionLoop());
    const loopResult = await result.current(
      {
        loopEnabled: true,
        loopElements: 'return [1, 2];',
      },
      mockElementCallback
    );
    expect(loopResult).toEqual([
      { element: 1, data: 2 },
      { element: 2, data: 3 },
    ]);
  });
});
