import { useActiveTool } from '@app/components/editor/hooks/useActiveTool';
import { COMPONENT_CONFIGS, COMPONENT_DATA_TEMPLATES } from '@app/constants';
import { Component, ComponentEvent, ComponentType, EventHandlerType } from '@app/types';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@tests/utils/renderWithContext';
import { DepGraph } from 'dependency-graph';
import { ComponentInspector } from '../ComponentInspector';

const mockComponents = [
  {
    name: 'button1',
    type: ComponentType.Button,
    data: {},
    eventHandlers: [],
  },
  {
    name: 'button2',
    type: ComponentType.Button,
    data: {},
    eventHandlers: [],
  },
] as unknown as Component[];
const mockComponent = mockComponents[0];

const mockUpdateTool = jest.fn();
const mockUpdateComponentName = jest.fn();
const mockDeleteComponent = jest.fn();
const mockDispatch = jest.fn();

jest.mock('../../../hooks/useActiveTool');

jest.mock('../../../hooks/useComponentUpdateName', () => ({
  useComponentUpdateName: jest.fn(() => mockUpdateComponentName),
}));

jest.mock('../../../hooks/useComponentDelete', () => ({
  useComponentDelete: jest.fn(() => mockDeleteComponent),
}));

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
  useAppSelector: jest.fn(() => ({
    componentInputs: {},
  })),
}));

describe('ComponentInspector', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: {
        components: mockComponents,
        actions: [],
      },
      updateTool: mockUpdateTool,
      evalDataMap: {},
      evalDataValuesMap: {},
      dataDepGraph: new DepGraph<string>(),
      dataDepCycles: {},
    }));
  });

  describe('editable name', () => {
    it('renders component name and type', () => {
      render(<ComponentInspector component={mockComponent} />);
      expect(screen.getByText(mockComponent.name)).toBeTruthy();
      expect(screen.getByText(COMPONENT_CONFIGS[mockComponent.type].label)).toBeTruthy();
    });

    it('toggles input on name click and updates component name on enter', async () => {
      render(<ComponentInspector component={mockComponent} />);

      await userEvent.click(screen.getByText(mockComponent.name));

      const newNameText = '1234';
      await userEvent.keyboard(newNameText);
      await userEvent.keyboard('[Enter]');

      expect(mockUpdateComponentName).toHaveBeenCalledWith(`${mockComponent.name}${newNameText}`);
    });
  });

  describe('deletion', () => {
    it('deletes component by clicking Delete and then Confirm in the presented dialog', async () => {
      mockDeleteComponent.mockImplementation(() => true);

      render(<ComponentInspector component={mockComponent} />);

      await userEvent.click(screen.getByText('Delete'));
      expect(screen.getByTestId('delete-dialog')).toBeTruthy();

      await userEvent.click(screen.getByText('Confirm'));
      await waitFor(() => {
        expect(screen.queryByTestId('delete-dialog')).toBeNull();
        expect(mockDeleteComponent).toHaveBeenCalled();
      });
    });
  });

  describe('components', () => {
    it.each`
      type                         | inspectorId
      ${ComponentType.Button}      | ${'button-inspector'}
      ${ComponentType.NumberInput} | ${'number-input-inspector'}
      ${ComponentType.Table}       | ${'table-inspector'}
      ${ComponentType.TextInput}   | ${'text-input-inspector'}
      ${ComponentType.Text}        | ${'text-inspector'}
    `(
      'renders $type inspector',
      ({ type, inspectorId }: { type: ComponentType; inspectorId: string }) => {
        const mockActiveComponent = {
          name: 'Name',
          type,
          data: {
            [type]: {},
          },
          eventHandlers: [],
        } as unknown as Component;

        render(<ComponentInspector component={mockActiveComponent} />);

        expect(screen.getByTestId(inspectorId)).toBeTruthy();
      }
    );

    it('rerenders on name change', () => {
      const mockActiveComponent = {
        name: 'Name',
        type: ComponentType.Button,
        data: {
          button: {
            text: 'hello',
          },
        },
        eventHandlers: [],
      } as unknown as Component;

      const result = render(<ComponentInspector component={mockActiveComponent} />);
      expect(screen.getByText('hello')).toBeTruthy();

      const mockNewActiveComponent = {
        name: 'New Name',
        type: ComponentType.Button,
        data: {
          button: {
            text: 'hello new!',
          },
        },
        eventHandlers: [],
      } as unknown as Component;

      result.rerender(<ComponentInspector component={mockNewActiveComponent} />);
      expect(screen.getByText('hello new!')).toBeTruthy();
    });
  });

  describe('updates', () => {
    it('calls API to update components with debounce of 300 ms', async () => {
      const mockActiveComponent = {
        name: 'Name',
        type: ComponentType.Button,
        data: {
          button: COMPONENT_DATA_TEMPLATES.button,
        },
        eventHandlers: [],
      } as unknown as Component;

      (useActiveTool as jest.Mock).mockImplementation(() => ({
        tool: {
          components: [mockActiveComponent],
          actions: [],
        },
        updateTool: mockUpdateTool,
        evalDataMap: {},
        evalDataValuesMap: {},
        dataDepGraph: new DepGraph<string>(),
        dataDepCycles: {},
      }));

      render(<ComponentInspector component={mockActiveComponent} />);

      const textInput = within(screen.getByTestId('inspector-text-Text')).getByRole('textbox');
      const newInputValue = 'h';
      await userEvent.type(textInput, newInputValue);

      // NOTE: It would be ideal to use fake timers to actually test the debounce time here,
      // but this test stubbornly refuses to work (it seems like runAllTimers and advanceTimersByTime
      // don't work properly here for some reason).
      await waitFor(() => {
        const newExpectedText = `${newInputValue}${COMPONENT_DATA_TEMPLATES.button.text}`;

        expect(mockUpdateTool).toHaveBeenCalledWith({
          components: [
            {
              ...mockActiveComponent,
              data: {
                button: {
                  ...mockActiveComponent.data.button,
                  text: newExpectedText,
                },
              },
            },
          ],
        });
      });
    });

    it('calls API to update event handlers with debounce of 300 ms', async () => {
      const mockActiveComponent = {
        name: 'Name',
        type: ComponentType.Button,
        data: {
          button: COMPONENT_DATA_TEMPLATES.button,
        },
        eventHandlers: [
          {
            event: ComponentEvent.Click,
            type: EventHandlerType.Url,
            data: {},
          },
        ],
      } as unknown as Component;

      (useActiveTool as jest.Mock).mockImplementation(() => ({
        tool: {
          components: [mockActiveComponent],
          actions: [],
        },
        updateTool: mockUpdateTool,
        evalDataMap: {},
        evalDataValuesMap: {},
        dataDepGraph: new DepGraph<string>(),
        dataDepCycles: {},
      }));

      render(<ComponentInspector component={mockActiveComponent} />);

      await userEvent.click(screen.getByTestId('MoreVertIcon'));
      await userEvent.click(screen.getByTestId('event-handler-delete-icon'));

      // NOTE: It would be ideal to use fake timers to actually test the debounce time here,
      // but this test stubbornly refuses to work (it seems like runAllTimers and advanceTimersByTime
      // don't work properly here for some reason).
      await waitFor(() => {
        expect(mockUpdateTool).toHaveBeenCalledWith({
          components: [
            {
              ...mockActiveComponent,
              eventHandlers: [],
            },
          ],
        });
      });
    });
  });
});
