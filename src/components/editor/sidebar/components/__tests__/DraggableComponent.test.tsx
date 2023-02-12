import { ComponentType } from '@app/types';
import { mockTool } from '@tests/constants/data';
import { render } from '@tests/utils/renderWithContext';
import { DraggableComponent } from '../DraggableComponent';

const mockIcon = 'Icon';
const mockLabel = 'Label';
const mockComponentType = ComponentType.Button;

jest.mock('../../../hooks/useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({ tool: mockTool })),
}));

describe('DraggableComponent', () => {
  it('renders icon', () => {
    const result = render(
      <DraggableComponent
        icon={mockIcon}
        label={mockLabel}
        type={mockComponentType}
      />
    );
    expect(result.getByText(mockIcon)).toBeTruthy();
  });

  it('renders label', () => {
    const result = render(
      <DraggableComponent
        icon={mockIcon}
        label={mockLabel}
        type={mockComponentType}
      />
    );
    expect(result.getByText(mockLabel)).toBeTruthy();
  });
});
