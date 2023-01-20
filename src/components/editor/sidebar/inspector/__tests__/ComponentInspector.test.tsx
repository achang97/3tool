import { COMPONENTS_BY_TYPE } from '@app/constants';
import {
  blurComponentFocus,
  setSnackbarMessage,
} from '@app/redux/features/editorSlice';
import { ComponentType, Tool } from '@app/types';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentInspector } from '../ComponentInspector';

const mockTool: Tool = {
  id: '1',
  name: 'Tool',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  creator: {
    name: 'Andrew',
  },
  components: [
    {
      name: 'button1',
      type: ComponentType.Button,
      layout: {
        w: 1,
        h: 1,
        x: 1,
        y: 1,
      },
      metadata: {},
    },
    {
      name: 'button2',
      type: ComponentType.Button,
      layout: {
        w: 2,
        h: 2,
        x: 2,
        y: 2,
      },
      metadata: {},
    },
  ],
};
const mockComponent = mockTool.components[0];

const mockUpdateTool = jest.fn();
const mockDispatch = jest.fn();

jest.mock('../../../hooks/useGetActiveTool', () => ({
  useGetActiveTool: jest.fn(() => mockTool),
}));

jest.mock('../../../hooks/useUpdateActiveTool', () => ({
  useUpdateActiveTool: jest.fn(() => mockUpdateTool),
}));

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

describe('ComponentInspector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing if no component with corresponding name is found', () => {
    const result = render(<ComponentInspector name="invalid" />);
    expect(result.queryByTestId('component-inspector')).toBeNull();
  });

  it('renders component name and type', () => {
    const result = render(<ComponentInspector name={mockComponent.name} />);
    expect(result.getByText(mockComponent.name)).toBeDefined();
    expect(
      result.getByText(COMPONENTS_BY_TYPE[mockComponent.type].label)
    ).toBeDefined();
  });

  it('toggles input on name click and updates component name on enter', async () => {
    const result = render(<ComponentInspector name={mockComponent.name} />);

    await userEvent.click(result.getByText(mockComponent.name));

    const newNameText = '1234';
    await userEvent.keyboard(newNameText);
    await userEvent.keyboard('[Enter]');

    expect(mockUpdateTool).toHaveBeenCalledWith({
      components: [
        { ...mockComponent, name: `${mockComponent.name}${newNameText}` },
        ...mockTool.components.slice(1),
      ],
    });
  });

  it('toggles input on name click and shows error if name contains invalid characters', async () => {
    const result = render(<ComponentInspector name={mockComponent.name} />);

    await userEvent.click(result.getByText(mockComponent.name));

    await userEvent.keyboard(' ! ');
    await userEvent.keyboard('[Enter]');

    expect(mockDispatch).toHaveBeenCalledWith(
      setSnackbarMessage({
        type: 'error',
        message: 'Name can only contain letters, numbers, _, or $',
      })
    );
    expect(mockUpdateTool).not.toHaveBeenCalled();
  });

  it('deletes component by clicking Delete and confirming in the presented dialog', async () => {
    mockUpdateTool.mockImplementation(() => ({ data: mockTool }));

    const result = render(<ComponentInspector name={mockComponent.name} />);

    await userEvent.click(result.getByText('Delete'));
    expect(result.getByTestId('delete-component-button-dialog')).toBeDefined();

    await userEvent.click(result.getByText('Confirm'));
    await waitFor(() => {
      expect(result.queryByTestId('delete-component-button-dialog')).toBeNull();
      expect(mockUpdateTool).toHaveBeenCalledWith({
        components: mockTool.components.slice(1),
      });
      expect(mockDispatch).toHaveBeenCalledWith(blurComponentFocus());
    });
  });
});
