import { focusComponent } from '@app/redux/features/editorSlice';
import { useAppSelector } from '@app/redux/hooks';
import { ComponentType } from '@app/types';
import { Box } from '@mui/material';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { CanvasComponent } from '../CanvasComponent';

const mockName = 'name';
const mockType = ComponentType.Button;
const mockChildren = 'children';

const mockDispatch = jest.fn();

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
  useAppSelector: jest.fn(),
}));

jest.mock('../../hooks/useComponentEvalData', () => ({
  useComponentEvalData: jest.fn(() => ({
    evalDataValues: {},
  })),
}));

describe('CanvasComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useAppSelector as jest.Mock).mockImplementation(() => ({
      componentInputs: {},
    }));
  });

  it('renders children', () => {
    const result = render(
      <CanvasComponent name={mockName} type={mockType}>
        {mockChildren}
      </CanvasComponent>
    );
    expect(result.getByText(mockChildren)).toBeTruthy();
  });

  it('forwards ref onto component', () => {
    const ref = createRef<HTMLDivElement>();
    const result = render(
      <CanvasComponent name={mockName} type={mockType} ref={ref}>
        {mockChildren}
      </CanvasComponent>
    );
    expect(result.container.firstChild).toEqual(ref.current);
  });

  it('focuses component on click and stops propagation of click event', async () => {
    const mockContainerHandleClick = jest.fn();
    const result = render(
      <Box onClick={mockContainerHandleClick}>
        <CanvasComponent name={mockName} type={mockType}>
          {mockChildren}
        </CanvasComponent>
      </Box>
    );
    await userEvent.click(result.getByText(mockChildren));
    expect(mockDispatch).toHaveBeenCalledWith(focusComponent(mockName));
    expect(mockContainerHandleClick).not.toHaveBeenCalled();
  });

  describe('classNames', () => {
    it('passes className to component', () => {
      const mockClassName = 'some-class';
      const result = render(
        <CanvasComponent
          name={mockName}
          type={mockType}
          className={mockClassName}
        >
          {mockChildren}
        </CanvasComponent>
      );
      const component = result.getByText(mockChildren);
      expect(component).toHaveClass(mockClassName);
    });

    it('assigns "react-grid-item-focused" class if name is equal to focused component name', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        componentInputs: {},
        focusedComponentName: mockName,
      }));
      const result = render(
        <CanvasComponent name={mockName} type={mockType}>
          {mockChildren}
        </CanvasComponent>
      );
      const component = result.getByText(mockChildren);
      expect(component).toHaveClass('react-grid-item-focused');
    });

    it('does not assign "react-grid-item-focused" class if name is not equal to focused component name', () => {
      const result = render(
        <CanvasComponent name={mockName} type={mockType}>
          {mockChildren}
        </CanvasComponent>
      );
      const component = result.getByText(mockChildren);
      expect(component).not.toHaveClass('react-grid-item-focused');
    });

    it('assigns "react-grid-item-dragging" class if name is equal to moving component name', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        componentInputs: {},
        movingComponentName: mockName,
      }));
      const result = render(
        <CanvasComponent name={mockName} type={mockType}>
          {mockChildren}
        </CanvasComponent>
      );
      const component = result.getByText(mockChildren);
      expect(component).toHaveClass('react-grid-item-dragging');
    });

    it('does not assign "react-grid-item-dragging" class if name is not equal to moving component name', () => {
      const result = render(
        <CanvasComponent name={mockName} type={mockType}>
          {mockChildren}
        </CanvasComponent>
      );
      const component = result.getByText(mockChildren);
      expect(component).not.toHaveClass('react-grid-item-dragging');
    });
  });

  describe('components', () => {
    it.each`
      type                         | componentId
      ${ComponentType.Button}      | ${'canvas-button'}
      ${ComponentType.NumberInput} | ${'canvas-number-input'}
      ${ComponentType.Table}       | ${'canvas-table'}
      ${ComponentType.TextInput}   | ${'canvas-text-input'}
      ${ComponentType.Text}        | ${'canvas-text'}
    `(
      'renders $type canvas component',
      ({ type, componentId }: { type: ComponentType; componentId: string }) => {
        const result = render(
          <CanvasComponent name={mockName} type={type}>
            {mockChildren}
          </CanvasComponent>
        );

        expect(result.getByTestId(componentId)).toBeTruthy();
      }
    );
  });
});
