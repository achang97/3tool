import { render } from '@testing-library/react';
import { CanvasButton, CanvasButtonProps } from '../CanvasButton';

const mockBasic: CanvasButtonProps['basic'] = {
  text: 'Text',
};

const mockInteraction: CanvasButtonProps['interaction'] = {};

describe('CanvasButton', () => {
  describe('basic', () => {
    it('renders text', () => {
      const result = render(
        <CanvasButton basic={mockBasic} interaction={mockInteraction} />
      );
      expect(result.getByText(mockBasic.text)).toBeDefined();
    });
  });
});
