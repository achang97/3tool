import { useActiveTool } from '@app/components/editor/hooks/useActiveTool';
import { COMPONENT_CONFIGS, COMPONENT_DATA_TEMPLATES } from '@app/constants';
import { Component, ComponentType } from '@app/types';
import { render, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    }));
  });

  describe('editable name', () => {
    it('renders component name and type', () => {
      const result = render(<ComponentInspector component={mockComponent} />);
      expect(result.getByText(mockComponent.name)).toBeTruthy();
      expect(
        result.getByText(COMPONENT_CONFIGS[mockComponent.type].label)
      ).toBeTruthy();
    });

    it('toggles input on name click and updates component name on enter', async () => {
      const result = render(<ComponentInspector component={mockComponent} />);

      await userEvent.click(result.getByText(mockComponent.name));

      const newNameText = '1234';
      await userEvent.keyboard(newNameText);
      await userEvent.keyboard('[Enter]');

      expect(mockUpdateComponentName).toHaveBeenCalledWith(
        `${mockComponent.name}${newNameText}`
      );
    });
  });

  describe('deletion', () => {
    it('deletes component by clicking Delete and then Confirm in the presented dialog', async () => {
      mockDeleteComponent.mockImplementation(() => true);

      const result = render(<ComponentInspector component={mockComponent} />);

      await userEvent.click(result.getByText('Delete'));
      expect(result.getByTestId('delete-dialog')).toBeTruthy();

      await userEvent.click(result.getByText('Confirm'));
      await waitFor(() => {
        expect(result.queryByTestId('delete-dialog')).toBeNull();
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

        (useActiveTool as jest.Mock).mockImplementation(() => ({
          tool: {
            components: [mockActiveComponent],
            actions: [],
          },
          updateTool: mockUpdateTool,
          evalDataMap: {},
          evalDataValuesMap: {},
          dataDepGraph: new DepGraph<string>(),
        }));

        const result = render(
          <ComponentInspector component={mockActiveComponent} />
        );

        expect(result.getByTestId(inspectorId)).toBeTruthy();
      }
    );
  });

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
    }));

    const result = render(
      <ComponentInspector component={mockActiveComponent} />
    );

    const textInput = within(result.getByTestId('code-mirror-Text')).getByRole(
      'textbox'
    );
    const newInputValue = 'h';
    await userEvent.type(textInput, newInputValue);

    // NOTE: It would be ideal to use fake timers to actually test the debounce time here,
    // but this test stubbornly refuses to work (it seems like runAllTimers and advanceTimersByTime
    // don't work properly here for some reason).
    expect(mockUpdateTool).not.toHaveBeenCalled();
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
});
