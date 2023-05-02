import { renderHook } from '@testing-library/react';
import { getNetwork, switchNetwork } from '@wagmi/core';
import { useSwitchNetwork } from '../useSwitchNetwork';

jest.mock('@wagmi/core', () => ({
  getNetwork: jest.fn(),
  switchNetwork: jest.fn(),
}));

describe('useSwitchNetwork', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not switch network if current chain is the same', async () => {
    (getNetwork as jest.Mock).mockImplementation(() => ({ chain: { id: 1 } }));
    const { result } = renderHook(() => useSwitchNetwork());
    result.current(1);
    expect(switchNetwork).not.toHaveBeenCalled();
  });

  it('switches network if current chain is different', () => {
    (getNetwork as jest.Mock).mockImplementation(() => ({ chain: { id: 1 } }));
    const { result } = renderHook(() => useSwitchNetwork());
    result.current(5);
    expect(switchNetwork).toHaveBeenCalledWith({ chainId: 5 });
  });
});
