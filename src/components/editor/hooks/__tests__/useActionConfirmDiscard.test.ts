import { renderHook } from '@testing-library/react';
import { useActionConfirmDiscard } from '../useActionConfirmDiscard';
import { useActionIsEditing } from '../useActionIsEditing';

jest.mock('../useActionIsEditing');

describe('useActionConfirmDiscard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not ask for user confirmation if not editing', () => {
    (useActionIsEditing as jest.Mock).mockImplementation(() => false);

    const { result } = renderHook(() => useActionConfirmDiscard());

    expect(result.current()).toEqual(true);
    expect(window.confirm).not.toHaveBeenCalled();
  });

  it('shows confirmation alert if editing', () => {
    (useActionIsEditing as jest.Mock).mockImplementation(() => true);
    (window.confirm as jest.Mock).mockImplementation(() => true);

    const { result } = renderHook(() => useActionConfirmDiscard());
    result.current();
    expect(window.confirm).toHaveBeenCalledWith(
      "You didn't save your action. Are you sure you want to discard your changes?"
    );
  });

  it('returns true if user confirms in alert', () => {
    (useActionIsEditing as jest.Mock).mockImplementation(() => true);
    (window.confirm as jest.Mock).mockImplementation(() => true);

    const { result } = renderHook(() => useActionConfirmDiscard());
    expect(result.current()).toEqual(true);
  });

  it('returns false if user cancels in alert', () => {
    (useActionIsEditing as jest.Mock).mockImplementation(() => true);
    (window.confirm as jest.Mock).mockImplementation(() => false);

    const { result } = renderHook(() => useActionConfirmDiscard());
    expect(result.current()).toEqual(false);
  });
});
