import { focusComponent } from '@app/redux/features/editorSlice';
import { useAppSelector } from '@app/redux/hooks';
import { Component, ComponentType } from '@app/types';
import { Box } from '@mui/material';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { useComponentEvalData } from '../../hooks/useComponentEvalData';
import { ComponentEvalError, useComponentEvalErrors } from '../../hooks/useComponentEvalErrors';
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

  it('forwards ref onto component', () => {
    const ref = createRef<HTMLDivElement>();
    const result = render(
      <CanvasComponent component={mockComponent} ref={ref} isEditable>
        {mockChildren}
      </CanvasComponent>
    );
    expect(result.container.firstChild).toEqual(ref.current);
  });

  it('renders children if editable', () => {
    render(
      <CanvasComponent component={mockComponent} isEditable>
        {mockChildren}
      </CanvasComponent>
    );
    expect(screen.getByText(mockChildren)).toBeTruthy();
  });

  it('does not render children if not editable', () => {
    render(
      <CanvasComponent component={mockComponent} isEditable={false}>
        {mockChildren}
      </CanvasComponent>
    );
    expect(screen.queryByText(mockChildren)).toBeNull();
  });

  it('focuses component on click and stops propagation of click event', async () => {
    const mockContainerHandleClick = jest.fn();
    render(
      <Box onClick={mockContainerHandleClick}>
        <CanvasComponent component={mockComponent} isEditable>
          {mockChildren}
        </CanvasComponent>
      </Box>
    );
    await userEvent.click(screen.getByText(mockChildren));
    expect(mockDispatch).toHaveBeenCalledWith(focusComponent(mockComponent.name));
    expect(mockContainerHandleClick).not.toHaveBeenCalled();
  });

  describe('classNames', () => {
    it('assigns className to component', () => {
      const mockClassName = 'some-class';
      render(
        <CanvasComponent component={mockComponent} className={mockClassName} isEditable>
          {mockChildren}
        </CanvasComponent>
      );
      const component = screen.getByText(mockChildren);
      expect(component).toHaveClass(mockClassName);
    });

    it('only assigns className to component if not editable', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        componentInputs: {},
        focusedComponentName: mockComponent.name,
      }));
      const mockClassName = 'some-class';

      render(
        <CanvasComponent component={mockComponent} className={mockClassName} isEditable>
          {mockChildren}
        </CanvasComponent>
      );
      const component = screen.getByText(mockChildren);
      expect(component).toHaveClass(mockClassName);
    });

    describe('focused', () => {
      it('assigns "react-grid-item-focused" class if name is equal to focused component name', () => {
        (useAppSelector as jest.Mock).mockImplementation(() => ({
          componentInputs: {},
          focusedComponentName: mockComponent.name,
        }));
        render(
          <CanvasComponent component={mockComponent} isEditable>
            {mockChildren}
          </CanvasComponent>
        );
        const component = screen.getByText(mockChildren);
        expect(component).toHaveClass('react-grid-item-focused');
      });

      it('does not assign "react-grid-item-focused" class if name is not equal to focused component name', () => {
        render(
          <CanvasComponent component={mockComponent} isEditable>
            {mockChildren}
          </CanvasComponent>
        );
        const component = screen.getByText(mockChildren);
        expect(component).not.toHaveClass('react-grid-item-focused');
      });
    });

    describe('dragging', () => {
      it('assigns "react-grid-item-dragging" class if name is equal to moving component name', () => {
        (useAppSelector as jest.Mock).mockImplementation(() => ({
          componentInputs: {},
          movingComponentName: mockComponent.name,
        }));
        render(
          <CanvasComponent component={mockComponent} isEditable>
            {mockChildren}
          </CanvasComponent>
        );
        const component = screen.getByText(mockChildren);
        expect(component).toHaveClass('react-grid-item-dragging');
      });

      it('does not assign "react-grid-item-dragging" class if name is not equal to moving component name', () => {
        render(
          <CanvasComponent component={mockComponent} isEditable>
            {mockChildren}
          </CanvasComponent>
        );
        const component = screen.getByText(mockChildren);
        expect(component).not.toHaveClass('react-grid-item-dragging');
      });
    });

    describe('resizing', () => {
      it('assigns "react-grid-item-resizing" class if name is equal to resizing component name', () => {
        (useAppSelector as jest.Mock).mockImplementation(() => ({
          componentInputs: {},
          resizingComponentName: mockComponent.name,
        }));
        render(
          <CanvasComponent component={mockComponent} isEditable>
            {mockChildren}
          </CanvasComponent>
        );
        const component = screen.getByText(mockChildren);
        expect(component).toHaveClass('react-grid-item-resizing');
      });

      it('does not assign "react-grid-item-resizing" class if name is not equal to resizing component name', () => {
        render(
          <CanvasComponent component={mockComponent} isEditable>
            {mockChildren}
          </CanvasComponent>
        );
        const component = screen.getByText(mockChildren);
        expect(component).not.toHaveClass('react-grid-item-resizing');
      });
    });

    describe('preview', () => {
      it('assigns "react-grid-item-preview" class if moving a component', () => {
        (useAppSelector as jest.Mock).mockImplementation(() => ({
          componentInputs: {},
          movingComponentName: 'name',
        }));
        render(
          <CanvasComponent component={mockComponent} isEditable>
            {mockChildren}
          </CanvasComponent>
        );
        const component = screen.getByText(mockChildren);
        expect(component).toHaveClass('react-grid-item-preview');
      });

      it('assigns "react-grid-item-preview" class if resizing a component', () => {
        (useAppSelector as jest.Mock).mockImplementation(() => ({
          componentInputs: {},
          resizingComponentName: 'name',
        }));
        render(
          <CanvasComponent component={mockComponent} isEditable>
            {mockChildren}
          </CanvasComponent>
        );
        const component = screen.getByText(mockChildren);
        expect(component).toHaveClass('react-grid-item-preview');
      });

      it('assigns "react-grid-item-preview" class if creating a new component', () => {
        (useAppSelector as jest.Mock).mockImplementation(() => ({
          componentInputs: {},
          newComponent: {
            name: 'name',
          },
        }));
        render(
          <CanvasComponent component={mockComponent} isEditable>
            {mockChildren}
          </CanvasComponent>
        );
        const component = screen.getByText(mockChildren);
        expect(component).toHaveClass('react-grid-item-preview');
      });

      it('does not assign "react-grid-item-preview" class if neither resizing nor moving', () => {
        render(
          <CanvasComponent component={mockComponent} isEditable>
            {mockChildren}
          </CanvasComponent>
        );
        const component = screen.getByText(mockChildren);
        expect(component).not.toHaveClass('react-grid-item-preview');
      });
    });

    describe('hovered', () => {
      it('assigns "react-grid-item-hovered" class if hovered over component', async () => {
        render(
          <CanvasComponent component={mockComponent} isEditable>
            {mockChildren}
          </CanvasComponent>
        );
        const component = screen.getByText(mockChildren);
        await userEvent.hover(component);
        expect(component).toHaveClass('react-grid-item-hovered');
      });

      it('does not assign "react-grid-item-dragging" class if not hovered over component', () => {
        render(
          <CanvasComponent component={mockComponent} isEditable>
            {mockChildren}
          </CanvasComponent>
        );
        const component = screen.getByText(mockChildren);
        expect(component).not.toHaveClass('react-grid-item-hovered');
      });
    });

    describe('error', () => {
      it('assigns "react-grid-item-error" class if there are eval errors', () => {
        (useComponentEvalErrors as jest.Mock).mockImplementation(() => [mockComponentEvalError]);
        render(
          <CanvasComponent component={mockComponent} isEditable>
            {mockChildren}
          </CanvasComponent>
        );
        const component = screen.getByText(mockChildren);
        expect(component).toHaveClass('react-grid-item-error');
      });

      it('does not assign "react-grid-item-error" class if there are no eval errors', () => {
        (useComponentEvalErrors as jest.Mock).mockImplementation(() => []);
        render(
          <CanvasComponent component={mockComponent} isEditable>
            {mockChildren}
          </CanvasComponent>
        );
        const component = screen.getByText(mockChildren);
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
      render(
        <CanvasComponent component={mockComponent} isEditable>
          {mockChildren}
        </CanvasComponent>
      );
      expect(screen.queryByTestId(handleId)).toBeNull();
    });

    it('does not render handle if not editable', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        componentInputs: {},
        focusedComponentName: mockComponent.name,
      }));
      render(
        <CanvasComponent component={mockComponent} isEditable={false}>
          {mockChildren}
        </CanvasComponent>
      );
      expect(screen.queryByTestId(handleId)).toBeNull();
    });

    it('renders handle on focus', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        componentInputs: {},
        focusedComponentName: mockComponent.name,
      }));
      render(
        <CanvasComponent component={mockComponent} isEditable>
          {mockChildren}
        </CanvasComponent>
      );
      expect(screen.getByTestId(handleId)).toBeTruthy();
    });

    it('renders handle on hover', async () => {
      render(
        <CanvasComponent component={mockComponent} isEditable>
          {mockChildren}
        </CanvasComponent>
      );
      await userEvent.hover(screen.getByText(mockChildren));
      expect(await screen.findByTestId(handleId)).toBeTruthy();
    });

    it('renders handle if there are eval errors', async () => {
      (useComponentEvalErrors as jest.Mock).mockImplementation(() => [mockComponentEvalError]);

      render(
        <CanvasComponent component={mockComponent} isEditable>
          {mockChildren}
        </CanvasComponent>
      );

      expect(screen.getByTestId(handleId)).toBeTruthy();
      const errorIcon = await screen.findByTestId(handleErrorIconId);
      await userEvent.hover(errorIcon);
      expect(
        await screen.findByText(
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
        render(
          <CanvasComponent component={{ ...mockComponent, type }} isEditable>
            {mockChildren}
          </CanvasComponent>
        );

        expect(screen.getByTestId(componentId)).toBeTruthy();
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

      render(
        <CanvasComponent
          component={
            {
              name: 'button1',
              type: ComponentType.Button,
              data: {},
            } as Component
          }
          isEditable
        >
          {mockChildren}
        </CanvasComponent>
      );

      await userEvent.click(screen.getByText(mockEvalDataValues.text));
      expect(mockEventHandlerCallbacks.onClick).toHaveBeenCalled();
    });
  });
});
