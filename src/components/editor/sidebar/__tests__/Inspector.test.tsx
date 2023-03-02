import { useAppSelector } from '@app/redux/hooks';
import { mockTool } from '@tests/constants/data';
import { render } from '@tests/utils/renderWithContext';
import { DepGraph } from 'dependency-graph';
import { Inspector } from '../Inspector';

const mockUpdateTool = jest.fn();

jest.mock('@app/redux/hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
}));

jest.mock('../../hooks/useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: mockTool,
    updateTool: mockUpdateTool,
    evalDataMap: {},
    evalDataValuesMap: {},
    dataDepGraph: new DepGraph<string>(),
    dataDepCycles: {},
  })),
}));

jest.mock('../../hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => jest.fn()),
}));

describe('Inspector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders component inspector if there is a focused component', () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      focusedComponentName: mockTool.components[0].name,
    }));

    const result = render(<Inspector />);
    expect(result.getByTestId('component-inspector')).toBeTruthy();
  });

  it('renders tool inspector if there is no focused component', () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      focusedComponentName: undefined,
    }));

    const result = render(<Inspector />);
    expect(result.getByTestId('tool-inspector')).toBeTruthy();
  });
});
