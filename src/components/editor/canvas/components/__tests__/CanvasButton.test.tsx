import { useComponentEvalData } from '@app/components/editor/hooks/useComponentEvalData';
import { render } from '@testing-library/react';
import { CanvasButton } from '../CanvasButton';

const mockName = 'name';

jest.mock('../../../hooks/useComponentEvalData');

describe('CanvasButton', () => {
  const buttonId = 'canvas-button';

  describe('props', () => {
    it('text: renders text', () => {
      const mockEvalDataValues = { text: 'text' };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      const result = render(<CanvasButton name={mockName} />);
      expect(result.getByText(mockEvalDataValues.text)).toBeTruthy();
    });

    it('disabled: sets disabled prop', () => {
      const mockEvalDataValues = { disabled: true };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      const result = render(<CanvasButton name={mockName} />);
      expect(result.getByTestId(buttonId)).toBeDisabled();
    });

    it('loading: sets loading prop', () => {
      const mockEvalDataValues = { text: 'text', loading: true };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      const result = render(<CanvasButton name={mockName} />);
      expect(result.getByTestId(buttonId)).toBeDisabled();
      expect(result.getByRole('progressbar')).toBeTruthy();
    });
  });
});
