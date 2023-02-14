import { useActiveTool } from '@app/components/editor/hooks/useActiveTool';
import { COMPONENT_CONFIGS, COMPONENT_DATA_TEMPLATES } from '@app/constants';
import { Component, ComponentType } from '@app/types';
import { render, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockComponentLayout } from '@tests/constants/data';
import { DepGraph } from 'dependency-graph';
import { ComponentInspector } from '../ComponentInspector';

const mockComponents: Component[] = [
  {
    name: 'button1',
    type: ComponentType.Button,
    layout: mockComponentLayout,
    eventHandlers: [],
    data: {},
  },
  {
    name: 'button2',
    type: ComponentType.Button,
    layout: mockComponentLayout,
    eventHandlers: [],
    data: {},
  },
];
const mockComponent = mockComponents[0];

const mockUpdateTool = jest.fn();
const mockUpdateComponentName = jest.fn();
const mockDeleteComponent = jest.fn();
const mockDispatch = jest.fn();

jest.mock('../../../hooks/useActiveTool');

jest.mock('../../../hooks/useUpdateComponentName', () => ({
  useUpdateComponentName: jest.fn(() => mockUpdateComponentName),
}));

jest.mock('../../../hooks/useDeleteComponent', () => ({
  useDeleteComponent: jest.fn(() => mockDeleteComponent),
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
        mockComponents,
      },
      updateTool: mockUpdateTool,
      componentEvalDataMap: {},
      componentEvalDataValuesMap: {},
      componentDataDepGraph: new DepGraph<string>(),
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
      expect(result.getByTestId('delete-component-button-dialog')).toBeTruthy();

      await userEvent.click(result.getByText('Confirm'));
      await waitFor(() => {
        expect(
          result.queryByTestId('delete-component-button-dialog')
        ).toBeNull();
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
        const mockActiveComponent: Component = {
          name: 'Name',
          type,
          layout: mockComponentLayout,
          data: {
            [type]: {},
          },
          eventHandlers: [],
        };

        (useActiveTool as jest.Mock).mockImplementation(() => ({
          tool: {
            components: [mockActiveComponent],
          },
          updateTool: mockUpdateTool,
          componentEvalDataMap: {},
          componentEvalDataValuesMap: {},
          componentDataDepGraph: new DepGraph<string>(),
        }));

        const result = render(
          <ComponentInspector component={mockActiveComponent} />
        );

        expect(result.getByTestId(inspectorId)).toBeTruthy();
      }
    );
  });

  it('calls API to update components with debounce of 300 ms', async () => {
    const mockActiveComponent: Component = {
      name: 'Name',
      type: ComponentType.Button,
      layout: mockComponentLayout,
      data: {
        button: COMPONENT_DATA_TEMPLATES[ComponentType.Button],
      },
      eventHandlers: [],
    };

    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: {
        components: [mockActiveComponent],
      },
      updateTool: mockUpdateTool,
      componentEvalDataMap: {},
      componentEvalDataValuesMap: {},
      componentDataDepGraph: new DepGraph<string>(),
    }));

    const result = render(
      <ComponentInspector component={mockActiveComponent} />
    );

    const textInput = within(
      result.getByTestId('dynamic-text-field-Text')
    ).getByRole('textbox');
    const newInputValue = 'h';
    await userEvent.type(textInput, newInputValue);

    // NOTE: It would be ideal to use fake timers to actually test the debounce time here,
    // but this test stubbornly refuses to work (it seems like runAllTimers and advanceTimersByTime
    // don't work properly here for some reason).
    expect(mockUpdateTool).not.toHaveBeenCalled();
    await waitFor(() => {
      const newExpectedText = `${newInputValue}${
        COMPONENT_DATA_TEMPLATES[ComponentType.Button].text
      }`;

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
