import userEvent from '@testing-library/user-event';
import { mockTool } from '@tests/constants/data';
import { render } from '@tests/utils/renderWithContext';
import { DepGraph } from 'dependency-graph';
import { Editor } from '../Editor';

jest.mock('../hooks/useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: mockTool,
    updateTool: jest.fn(),
    evalDataMap: {},
    evalDataValuesMap: {},
    dataDepGraph: new DepGraph<string>(),
  })),
}));

jest.mock('../hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => jest.fn()),
}));

describe('Editor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders editor toolbar', () => {
    const result = render(<Editor />);
    expect(result.getByTestId('canvas-toolbar')).toBeTruthy();
  });

  it('renders editor sidebar', async () => {
    const result = render(<Editor />);

    // Default view should be the component picker
    expect(result.getByTestId('component-picker')).toBeTruthy();

    await userEvent.click(result.getByText('Inspector'));
    expect(result.getByTestId('inspector')).toBeTruthy();

    await userEvent.click(result.getByText('Components'));
    expect(result.getByTestId('component-picker')).toBeTruthy();
  });

  it('renders editor canvas and components', async () => {
    const result = render(<Editor />);

    expect(result.getByTestId('editor-canvas')).toBeTruthy();
    mockTool.components.forEach((component) => {
      expect(
        result.getByTestId(`canvas-component-${component.name}`)
      ).toBeTruthy();
    });
  });

  it('renders editor action list and editor', async () => {
    const result = render(<Editor />);

    expect(result.getByTestId('action-list')).toBeTruthy();
    mockTool.actions.forEach((action) => {
      expect(
        result.getByTestId(`action-list-item-${action.name}`)
      ).toBeTruthy();
    });

    await userEvent.click(
      result.getByTestId(`action-list-item-${mockTool.actions[0].name}`)
    );
    expect(result.getByTestId('action-editor')).toBeTruthy();
  });
});
