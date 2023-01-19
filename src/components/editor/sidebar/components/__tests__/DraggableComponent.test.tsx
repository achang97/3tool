import { ComponentType } from '@app/types';
import { render } from '@tests/utils/renderWithContext';
import { DraggableComponent } from '../DraggableComponent';

const mockIcon = 'Icon';
const mockLabel = 'Label';
const mockComponentType = ComponentType.Button;

jest.mock('../../../hooks/useGetActiveTool', () => ({
  useGetActiveTool: jest.fn(() => undefined),
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
    expect(result.getByText(mockIcon)).toBeDefined();
  });

  it('renders label', () => {
    const result = render(
      <DraggableComponent
        icon={mockIcon}
        label={mockLabel}
        type={mockComponentType}
      />
    );
    expect(result.getByText(mockLabel)).toBeDefined();
  });
});
