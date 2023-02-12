import { useComponentEvalData } from '@app/components/editor/hooks/useComponentEvalData';
import { render } from '@testing-library/react';
import { CanvasText } from '../CanvasText';

const mockName = 'name';

jest.mock('../../../hooks/useComponentEvalData');

describe('CanvasText', () => {
  const textId = 'canvas-text';

  describe('props', () => {
    it('value: renders value as text', () => {
      const mockEvalDataValues = { value: 'value' };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      const result = render(<CanvasText name={mockName} />);
      expect(result.getByText(mockEvalDataValues.value)).toBeTruthy();
    });

    it('horizontalAlignment: sets textAlign prop', () => {
      const mockEvalDataValues = { horizontalAlignment: 'center' };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      const result = render(<CanvasText name={mockName} />);
      expect(result.getByTestId(textId)).toHaveStyle({
        textAlign: mockEvalDataValues.horizontalAlignment,
      });
    });
  });
});
