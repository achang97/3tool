import { useAppSelector } from '@app/redux/hooks';
import { ComponentType } from '@app/types';
import { screen, render } from '@testing-library/react';
import { DraggableComponent } from '../DraggableComponent';

const mockDispatch = jest.fn();

const mockIcon = 'Icon';
const mockLabel = 'Label';
const mockComponentType = ComponentType.Button;

jest.mock('../../../hooks/useToolElementNames', () => ({
  useToolElementNames: jest.fn(() => ({ elementNames: [] })),
}));

jest.mock('@app/redux/hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(() => mockDispatch),
}));

describe('DraggableComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation(() => ({}));
  });

  it('renders icon', () => {
    render(<DraggableComponent icon={mockIcon} label={mockLabel} type={mockComponentType} />);
    expect(screen.getByText(mockIcon)).toBeTruthy();
  });

  it('renders label', () => {
    render(<DraggableComponent icon={mockIcon} label={mockLabel} type={mockComponentType} />);
    expect(screen.getByText(mockLabel)).toBeTruthy();
  });

  it('sets opacity to 0.5 if currently dragging type', () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      newComponent: { type: mockComponentType },
    }));
    const result = render(
      <DraggableComponent icon={mockIcon} label={mockLabel} type={mockComponentType} />
    );
    expect(result.container.firstChild).toHaveStyle({ opacity: 0.5 });
  });

  it('sets opacity to 1 if not currently dragging type', () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({}));
    const result = render(
      <DraggableComponent icon={mockIcon} label={mockLabel} type={mockComponentType} />
    );
    expect(result.container.firstChild).toHaveStyle({ opacity: 1 });
  });
});
