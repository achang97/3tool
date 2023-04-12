import { useComponentEvalData } from '@app/components/editor/hooks/useComponentEvalData';
import { screen, render } from '@testing-library/react';
import { CanvasText } from '../CanvasText';

const mockName = 'name';
const mockEventHandlerCallbacks = {};

jest.mock('../../../hooks/useComponentEvalData');

describe('CanvasText', () => {
  const textId = 'canvas-text';

  describe('props', () => {
    it('value: renders value as text', () => {
      const mockEvalDataValues = { value: 'value' };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      render(<CanvasText name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />);
      expect(screen.getByText(mockEvalDataValues.value)).toBeTruthy();
    });

    it('horizontalAlignment: sets textAlign prop', () => {
      const mockEvalDataValues = { horizontalAlignment: 'center' };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      render(<CanvasText name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />);
      expect(screen.getByTestId(textId)).toHaveStyle({
        textAlign: mockEvalDataValues.horizontalAlignment,
      });
    });
  });
});
