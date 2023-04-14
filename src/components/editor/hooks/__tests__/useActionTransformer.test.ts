import { renderHook } from '@tests/utils/renderWithContext';
import { useActionTransformer } from '../useActionTransformer';

describe('useActionTransformer', () => {
  it('returns input data if transformer is not enabled', async () => {
    const { result } = renderHook(() => useActionTransformer());
    const transformedData = await result.current(
      { transformerEnabled: false, transformer: 'return data + 1' },
      1
    );
    expect(transformedData).toEqual(1);
  });

  it('returns transformer result with data as input', async () => {
    const { result } = renderHook(() => useActionTransformer());
    const transformedData = await result.current(
      { transformerEnabled: true, transformer: 'return data + 1' },
      1
    );
    expect(transformedData).toEqual(2);
  });
});
