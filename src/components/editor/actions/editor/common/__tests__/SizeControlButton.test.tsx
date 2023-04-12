import { setIsActionViewMaximized } from '@app/redux/features/editorSlice';
import { useAppSelector } from '@app/redux/hooks';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SizeControlButton } from '../SizeControlButton';

const mockDispatch = jest.fn();

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
  useAppSelector: jest.fn(),
}));

describe('SizeControlButton', () => {
  it('renders minimize button if maximized', async () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      isActionViewMaximized: true,
    }));

    render(<SizeControlButton />);
    const icon = screen.getByTestId('size-control-button-minimize');

    await userEvent.click(icon);
    expect(mockDispatch).toHaveBeenCalledWith(setIsActionViewMaximized(false));
  });

  it('renders maximize button if minimized', async () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      isActionViewMaximized: false,
    }));

    render(<SizeControlButton />);
    const icon = screen.getByTestId('size-control-button-maximize');

    await userEvent.click(icon);
    expect(mockDispatch).toHaveBeenCalledWith(setIsActionViewMaximized(true));
  });
});
