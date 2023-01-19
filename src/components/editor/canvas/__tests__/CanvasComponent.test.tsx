import { focusComponent } from '@app/redux/features/editorSlice';
import { Component, ComponentType } from '@app/types';
import { Box } from '@mui/material';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { CanvasComponent } from '../CanvasComponent';

const mockName = 'name';
const mockType = ComponentType.Button;
const mockMetadata: Component['metadata'] = {
  button: {
    basic: {
      text: 'Text',
    },
    interaction: {},
  },
};
const mockChildren = 'children';

const mockDispatch = jest.fn();

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

describe('CanvasComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children', () => {
    const result = render(
      <CanvasComponent
        name={mockName}
        type={mockType}
        metadata={mockMetadata}
        isDragging
        isFocused
      >
        {mockChildren}
      </CanvasComponent>
    );
    expect(result.getByText(mockChildren)).toBeDefined();
  });

  it('forwards ref onto component', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <CanvasComponent
        name={mockName}
        type={mockType}
        metadata={mockMetadata}
        isDragging
        isFocused
        ref={ref}
      >
        {mockChildren}
      </CanvasComponent>
    );
    expect(ref.current).toHaveProperty('id', mockName);
  });

  it('assigns name as id to component', () => {
    const result = render(
      <CanvasComponent
        name={mockName}
        type={mockType}
        metadata={mockMetadata}
        isDragging
        isFocused
      >
        {mockChildren}
      </CanvasComponent>
    );
    expect(result.container.querySelector(`#${mockName}`)).toBeDefined();
  });

  it('focuses component on click and stops propagation of click event', async () => {
    const mockContainerHandleClick = jest.fn();
    const result = render(
      <Box onClick={mockContainerHandleClick}>
        <CanvasComponent
          name={mockName}
          type={mockType}
          metadata={mockMetadata}
          isDragging
          isFocused
        >
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
          metadata={mockMetadata}
          isDragging
          isFocused
          className={mockClassName}
        >
          {mockChildren}
        </CanvasComponent>
      );
      const component = result.getByText(mockChildren);
      expect(component).toHaveClass(mockClassName);
    });

    it('assigns "react-grid-item-focused" class if isFocused is true', () => {
      const result = render(
        <CanvasComponent
          name={mockName}
          type={mockType}
          metadata={mockMetadata}
          isDragging
          isFocused
        >
          {mockChildren}
        </CanvasComponent>
      );
      const component = result.getByText(mockChildren);
      expect(component).toHaveClass('react-grid-item-focused');
    });

    it('does not assign "react-grid-item-focused" class if not isFocused is false', () => {
      const result = render(
        <CanvasComponent
          name={mockName}
          type={mockType}
          metadata={mockMetadata}
          isDragging
          isFocused={false}
        >
          {mockChildren}
        </CanvasComponent>
      );
      const component = result.getByText(mockChildren);
      expect(component).not.toHaveClass('react-grid-item-focused');
    });

    it('assigns "react-grid-item-dragging" class if isDragging is true', () => {
      const result = render(
        <CanvasComponent
          name={mockName}
          type={mockType}
          metadata={mockMetadata}
          isDragging
          isFocused={false}
        >
          {mockChildren}
        </CanvasComponent>
      );
      const component = result.getByText(mockChildren);
      expect(component).toHaveClass('react-grid-item-dragging');
    });

    it('does not assign "react-grid-item-dragging" class if not isDragging is false', () => {
      const result = render(
        <CanvasComponent
          name={mockName}
          type={mockType}
          metadata={mockMetadata}
          isDragging={false}
          isFocused
        >
          {mockChildren}
        </CanvasComponent>
      );
      const component = result.getByText(mockChildren);
      expect(component).not.toHaveClass('react-grid-item-dragging');
    });
  });

  describe('components', () => {
    it('button: renders button', () => {
      const mockButtonMetadata: Component['metadata'] = {
        button: {
          basic: { text: 'Hello' },
          interaction: {},
        },
      };
      const result = render(
        <CanvasComponent
          name={mockName}
          type={ComponentType.Button}
          metadata={mockButtonMetadata}
          isDragging
          isFocused
        >
          {mockChildren}
        </CanvasComponent>
      );

      const button = result.getByTestId('canvas-button');
      expect(button).toHaveTextContent(mockButtonMetadata.button!.basic.text);
    });
  });
});
