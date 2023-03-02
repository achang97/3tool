import { useActiveTool } from '@app/components/editor/hooks/useActiveTool';
import { mockTool } from '@tests/constants/data';
import { render } from '@tests/utils/renderWithContext';
import { InspectorTextField } from '../InspectorTextField';

const mockName = 'name';
const mockHandleChange = jest.fn();

const mockEnqueueSnackbar = jest.fn();

jest.mock('@app/components/editor/hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => mockEnqueueSnackbar),
}));

jest.mock(
  '@app/components/editor/hooks/useCodeMirrorJavascriptAutocomplete',
  () => ({
    useCodeMirrorJavascriptAutocomplete: jest.fn(() => []),
  })
);

jest.mock('@app/components/editor/hooks/useActiveTool');

describe('InspectorTextField', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: mockTool,
    }));
  });

  it('does not enqueue error snackbar if there is no cycle path', () => {
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: mockTool,
      dataDepCycles: {},
    }));
    render(<InspectorTextField name={mockName} onChange={mockHandleChange} />);
    expect(mockEnqueueSnackbar).not.toHaveBeenCalled();
  });

  it('enqueues error snackbar on value change when there is a cycle path', () => {
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: mockTool,
      dataDepCycles: {
        [mockName]: ['1', '2'],
      },
    }));
    const result = render(
      <InspectorTextField name={mockName} onChange={mockHandleChange} />
    );
    expect(mockEnqueueSnackbar).not.toHaveBeenCalled();

    result.rerender(
      <InspectorTextField
        name={mockName}
        onChange={mockHandleChange}
        value="1"
      />
    );
    expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
      'Dependency Cycle Found: 1 → 2',
      { variant: 'error' }
    );
  });
});
