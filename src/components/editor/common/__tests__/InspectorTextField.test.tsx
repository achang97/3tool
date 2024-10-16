import { useActiveTool } from '@app/components/editor/hooks/useActiveTool';
import { mockTool } from '@tests/constants/data';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import { InspectorTextField } from '../InspectorTextField';

const mockName = 'name';
const mockHandleChange = jest.fn();

const mockEnqueueSnackbar = jest.fn();

jest.mock('@app/hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => mockEnqueueSnackbar),
}));

jest.mock('@app/components/editor/hooks/useCodeMirrorJavascriptAutocomplete', () => ({
  useCodeMirrorJavascriptAutocomplete: jest.fn(() => []),
}));

jest.mock('@app/components/editor/hooks/useActiveTool');

describe('InspectorTextField', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: mockTool,
      dataDepCycles: {},
    }));
  });

  it('renders label', () => {
    const mockLabel = 'label';
    render(
      <InspectorTextField
        label={mockLabel}
        type="string"
        name={mockName}
        onChange={mockHandleChange}
      />
    );
    expect(screen.getByText(mockLabel)).toBeTruthy();
  });

  it('does not enqueue error snackbar if there is no cycle path', () => {
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: mockTool,
      dataDepCycles: {},
    }));
    render(<InspectorTextField type="string" name={mockName} onChange={mockHandleChange} />);
    expect(mockEnqueueSnackbar).not.toHaveBeenCalled();
  });

  it('does not enqueue error snackbar if not autosaved', () => {
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: mockTool,
      dataDepCycles: {
        [mockName]: ['1', '2'],
      },
    }));
    const result = render(
      <InspectorTextField type="string" name={mockName} onChange={mockHandleChange} />
    );
    expect(mockEnqueueSnackbar).not.toHaveBeenCalled();

    result.rerender(
      <InspectorTextField type="string" name={mockName} onChange={mockHandleChange} value="1" />
    );
    expect(mockEnqueueSnackbar).not.toHaveBeenCalled();
  });

  it('enqueues error snackbar on value change if autosaved and there is a cycle path', () => {
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: mockTool,
      dataDepCycles: {
        [mockName]: ['1', '2'],
      },
    }));
    const result = render(
      <InspectorTextField type="string" name={mockName} onChange={mockHandleChange} isAutosaved />
    );
    expect(mockEnqueueSnackbar).not.toHaveBeenCalled();

    result.rerender(
      <InspectorTextField
        type="string"
        name={mockName}
        onChange={mockHandleChange}
        value="1"
        isAutosaved
      />
    );
    expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Dependency Cycle Found: 1 → 2', {
      variant: 'error',
    });
  });
});
