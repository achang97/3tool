import { focusComponent } from '@app/redux/features/editorSlice';
import { useAppSelector } from '@app/redux/hooks';
import { Component, ComponentType } from '@app/types';
import { Box } from '@mui/material';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { useComponentEvalData } from '../../hooks/useComponentEvalData';
import {
  ComponentEvalError,
  useComponentEvalErrors,
} from '../../hooks/useComponentEvalErrors';
import { useComponentEventHandlerCallbacks } from '../../hooks/useComponentEventHandlerCallbacks';
import { CanvasComponent } from '../CanvasComponent';

const mockComponent = {
  name: 'button1',
  type: ComponentType.Button,
  data: {},
} as Component;
const mockChildren = 'children';

const mockComponentEvalError: ComponentEvalError = {
  name: 'text',
  error: new Error('Error message'),
};

const mockDispatch = jest.fn();

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
  useAppSelector: jest.fn(),
}));

jest.mock('../../hooks/useComponentEvalData');
jest.mock('../../hooks/useComponentEventHandlerCallbacks');
jest.mock('../../hooks/useComponentEvalErrors');

describe('CanvasComponent', () => {
  const handleId = 'canvas-component-handle';
  const handleErrorIconId = 'canvas-component-handle-error-icon';

  beforeEach(() => {
    jest.clearAllMocks();

    (useAppSelector as jest.Mock).mockImplementation(() => ({
      componentInputs: {},
    }));
    (useComponentEvalErrors as jest.Mock).mockImplementation(() => []);
    (useComponentEvalData as jest.Mock).mockImplementation(() => ({
      evalDataValues: {},
    }));
  });

  it('renders children', () => {
    const result = render(
      <CanvasComponent component={mockComponent}>
        {mockChildren}
      </CanvasComponent>
    );
    expect(result.getByText(mockChildren)).toBeTruthy();
  });

  it('forwards ref onto component', () => {
    const ref = createRef<HTMLDivElement>();
    const result = render(
      <CanvasComponent component={mockComponent} ref={ref}>
        {mockChildren}
      </CanvasComponent>
    );
    expect(result.container.firstChild).toEqual(ref.current);
  });

  it('focuses component on click and stops propagation of click event', async () => {
    const mockContainerHandleClick = jest.fn();
    const result = render(
      <Box onClick={mockContainerHandleClick}>
        <CanvasComponent component={mockComponent}>
          {mockChildren}
        </CanvasComponent>
      </Box>
    );
    await userEvent.click(result.getByText(mockChildren));
    expect(mockDispatch).toHaveBeenCalledWith(
      focusComponent(mockComponent.name)
    );
    expect(mockContainerHandleClick).not.toHaveBeenCalled();
  });

  describe('classNames', () => {
    it('passes className to component', () => {
      const mockClassName = 'some-class';
      const result = render(
        <CanvasComponent component={mockComponent} className={mockClassName}>
          {mockChildren}
        </CanvasComponent>
      );
      const component = result.getByText(mockChildren);
      expect(component).toHaveClass(mockClassName);
    });

    describe('focused', () => {
      it('assigns "react-grid-item-focused" class if name is equal to focused component name', () => {
        (useAppSelector as jest.Mock).mockImplementation(() => ({
          componentInputs: {},
          focusedComponentName: mockComponent.name,
        }));
        const result = render(
          <CanvasComponent component={mockComponent}>
            {mockChildren}
          </CanvasComponent>
        );
        const component = result.getByText(mockChildren);
        expect(component).toHaveClass('react-grid-item-focused');
      });

      it('does not assign "react-grid-item-focused" class if name is not equal to focused component name', () => {
        const result = render(
          <CanvasComponent component={mockComponent}>
            {mockChildren}
          </CanvasComponent>
        );
        const component = result.getByText(mockChildren);
        expect(component).not.toHaveClass('react-grid-item-focused');
      });
    });

    describe('dragging', () => {
      it('assigns "react-grid-item-dragging" class if name is equal to moving component name', () => {
        (useAppSelector as jest.Mock).mockImplementation(() => ({
          componentInputs: {},
          movingComponentName: mockComponent.name,
        }));
        const result = render(
          <CanvasComponent component={mockComponent}>
            {mockChildren}
          </CanvasComponent>
        );
        const component = result.getByText(mockChildren);
        expect(component).toHaveClass('react-grid-item-dragging');
      });

      it('does not assign "react-grid-item-dragging" class if name is not equal to moving component name', () => {
        const result = render(
          <CanvasComponent component={mockComponent}>
            {mockChildren}
          </CanvasComponent>
        );
        const component = result.getByText(mockChildren);
        expect(component).not.toHaveClass('react-grid-item-dragging');
      });
    });

    describe('error', () => {
      it('assigns "react-grid-item-error" class if there are eval errors', () => {
        (useComponentEvalErrors as jest.Mock).mockImplementation(() => [
          mockComponentEvalError,
        ]);
        const result = render(
          <CanvasComponent component={mockComponent}>
            {mockChildren}
          </CanvasComponent>
        );
        const component = result.getByText(mockChildren);
        expect(component).toHaveClass('react-grid-item-error');
      });

      it('does not assign "react-grid-item-error" class if there are no eval errors', () => {
        (useComponentEvalErrors as jest.Mock).mockImplementation(() => []);
        const result = render(
          <CanvasComponent component={mockComponent}>
            {mockChildren}
          </CanvasComponent>
        );
        const component = result.getByText(mockChildren);
        expect(component).not.toHaveClass('react-grid-item-error');
      });
    });
  });

  describe('handle', () => {
    it('does not render handle if not focused, hovered, or error', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        componentInputs: {},
        focusedComponentName: undefined,
        movingComponentName: undefined,
      }));
      (useComponentEvalErrors as jest.Mock).mockImplementation(() => []);
      const result = render(
        <CanvasComponent component={mockComponent}>
          {mockChildren}
        </CanvasComponent>
      );
      expect(result.queryByTestId(handleId)).toBeNull();
    });

    it('renders handle on focus', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        componentInputs: {},
        focusedComponentName: mockComponent.name,
      }));
      const result = render(
        <CanvasComponent component={mockComponent}>
          {mockChildren}
        </CanvasComponent>
      );
      expect(result.getByTestId(handleId)).toBeTruthy();
    });

    it('renders handle on hover', async () => {
      const result = render(
        <CanvasComponent component={mockComponent}>
          {mockChildren}
        </CanvasComponent>
      );
      await userEvent.hover(result.getByText(mockChildren));
      expect(await result.findByTestId(handleId)).toBeTruthy();
    });

    it('renders handle if there are eval errors', async () => {
      (useComponentEvalErrors as jest.Mock).mockImplementation(() => [
        mockComponentEvalError,
      ]);

      const result = render(
        <CanvasComponent component={mockComponent}>
          {mockChildren}
        </CanvasComponent>
      );

      expect(result.getByTestId(handleId)).toBeTruthy();
      const errorIcon = await result.findByTestId(handleErrorIconId);
      await userEvent.hover(errorIcon);
      expect(
        await result.findByText(
          `${mockComponentEvalError.name}: ${mockComponentEvalError.error.message}`
        )
      );
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
          <CanvasComponent component={{ ...mockComponent, type }}>
            {mockChildren}
          </CanvasComponent>
        );

        expect(result.getByTestId(componentId)).toBeTruthy();
      }
    );

    it('passes event handlers to component', async () => {
      const mockEventHandlerCallbacks = {
        onClick: jest.fn(),
      };
      const mockEvalDataValues = {
        text: 'text',
      };
      (useComponentEventHandlerCallbacks as jest.Mock).mockImplementation(
        () => mockEventHandlerCallbacks
      );
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      const result = render(
        <CanvasComponent
          component={
            {
              name: 'button1',
              type: ComponentType.Button,
              data: {},
            } as Component
          }
        >
          {mockChildren}
        </CanvasComponent>
      );

      await userEvent.click(result.getByText(mockEvalDataValues.text));
      expect(mockEventHandlerCallbacks.onClick).toHaveBeenCalled();
    });
  });
});
