import { setActionViewHeight } from '@app/redux/features/editorSlice';
import { useAppSelector } from '@app/redux/hooks';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ACTION_VIEW_MAX_HEIGHT, ACTION_VIEW_MIN_HEIGHT } from '@app/constants';
import { SizeControlButton } from '../SizeControlButton';

const mockDispatch = jest.fn();

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
  useAppSelector: jest.fn(),
}));

describe('SizeControlButton', () => {
  it('renders minimize button if maximized', async () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      actionViewHeight: ACTION_VIEW_MAX_HEIGHT,
    }));

    render(<SizeControlButton />);
    const icon = screen.getByTestId('size-control-button-minimize');

    await userEvent.click(icon);
    expect(mockDispatch).toHaveBeenCalledWith(setActionViewHeight(ACTION_VIEW_MIN_HEIGHT));
  });

  it('renders maximize button if not maximized', async () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      actionViewHeight: ACTION_VIEW_MAX_HEIGHT - 1,
    }));

    render(<SizeControlButton />);
    const icon = screen.getByTestId('size-control-button-maximize');

    await userEvent.click(icon);
    expect(mockDispatch).toHaveBeenCalledWith(setActionViewHeight(ACTION_VIEW_MAX_HEIGHT));
  });
});
