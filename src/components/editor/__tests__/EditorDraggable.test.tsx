import { ComponentType } from '@app/types';
import { render } from '@tests/utils/renderWithContext';
import { EditorDraggable } from '../EditorDraggable';

const mockIcon = 'Icon';
const mockLabel = 'Label';
const mockComponentType = ComponentType.Button;

describe('EditorDraggable', () => {
  it('renders icon', () => {
    const result = render(
      <EditorDraggable
        icon={mockIcon}
        label={mockLabel}
        componentType={mockComponentType}
      />
    );
    expect(result.getByText(mockIcon)).toBeDefined();
  });

  it('renders label', () => {
    const result = render(
      <EditorDraggable
        icon={mockIcon}
        label={mockLabel}
        componentType={mockComponentType}
      />
    );
    expect(result.getByText(mockLabel)).toBeDefined();
  });
});
