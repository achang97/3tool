import { useComponentEvalData } from '@app/components/editor/hooks/useComponentEvalData';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CanvasButton } from '../CanvasButton';

const mockName = 'name';
const mockEventHandlerCallbacks = {
  onClick: jest.fn(),
};

jest.mock('../../../hooks/useComponentEvalData');

describe('CanvasButton', () => {
  const buttonId = 'canvas-button';

  describe('props', () => {
    it('text: renders text', () => {
      const mockEvalDataValues = { text: 'text' };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      render(<CanvasButton name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />);
      expect(screen.getByText(mockEvalDataValues.text)).toBeTruthy();
    });

    it('disabled: sets disabled prop', () => {
      const mockEvalDataValues = { disabled: true };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      render(<CanvasButton name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />);
      expect(screen.getByTestId(buttonId)).toBeDisabled();
    });

    it('loading: sets loading prop', () => {
      const mockEvalDataValues = { text: 'text', loading: true };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      render(<CanvasButton name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />);
      expect(screen.getByTestId(buttonId)).toBeDisabled();
      expect(screen.getByRole('progressbar')).toBeTruthy();
    });
  });

  describe('event handlers', () => {
    it('passes event handlers to button', async () => {
      const mockEvalDataValues = { text: 'text' };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));
      render(<CanvasButton name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />);
      await userEvent.click(screen.getByText(mockEvalDataValues.text));
      expect(mockEventHandlerCallbacks.onClick).toHaveBeenCalled();
    });
  });
});
