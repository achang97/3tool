import { renderHook } from '@testing-library/react';
import { useActionCycleListener } from '../useActionCycleListener';
import { useActiveTool } from '../useActiveTool';

const mockEnqueueSnackbar = jest.fn();

jest.mock('@app/hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => mockEnqueueSnackbar),
}));

jest.mock('../useActiveTool');

describe('useActionCycleListener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useActiveTool as jest.Mock).mockImplementation(() => {});
  });

  it('enqueues error snackbar for all cycles with name as prefix', () => {
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      dataDepCycles: {
        'action1.code': ['action1.code', 'action1', 'action1.code'],
        'action1.error': ['action1.error', 'action1', 'action1.error'],
      },
    }));

    renderHook(() => useActionCycleListener('action1'));
    expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
      'Dependency Cycle Found: action1.code → action1 → action1.code',
      { variant: 'error' }
    );
    expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
      'Dependency Cycle Found: action1.error → action1 → action1.error',
      { variant: 'error' }
    );
  });

  it('does not enqueue error snackbar for cycles that do not match prefix', () => {
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      dataDepCycles: {
        'action2.code': ['action2.code', 'action2', 'action2.code'],
      },
    }));

    renderHook(() => useActionCycleListener('action1'));
    expect(mockEnqueueSnackbar).not.toHaveBeenCalled();
  });
});
