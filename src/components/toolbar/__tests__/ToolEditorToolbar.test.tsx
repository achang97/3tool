import { useGetToolByIdQuery } from '@app/redux/services/tools';
import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@testing-library/react';
import { focusToolSettings } from '@app/redux/features/editorSlice';
import { ToolEditorToolbar } from '../ToolEditorToolbar';

const mockDispatch = jest.fn();
const mockToolId = 'tool-id';

jest.mock('@app/redux/services/tools', () => ({
  useGetToolByIdQuery: jest.fn(),
}));

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({ query: { id: mockToolId } })),
}));

describe('ToolEditorToolbar', () => {
  const settingsButtonId = 'tool-editor-toolbar-settings-button';

  beforeEach(() => {
    jest.clearAllMocks();
    (useGetToolByIdQuery as jest.Mock).mockImplementation(() => ({}));
  });

  it('calls useGetToolByIdQuery with query id', () => {
    render(<ToolEditorToolbar />);
    expect(useGetToolByIdQuery as jest.Mock).toHaveBeenCalledWith(mockToolId);
  });

  describe('invalid tool', () => {
    beforeEach(() => {
      (useGetToolByIdQuery as jest.Mock).mockImplementation(() => ({}));
    });

    it('renders Untitled as title', () => {
      const result = render(<ToolEditorToolbar />);
      expect(result.queryByText('Untitled')).toBeDefined();
    });

    it('does not render action buttons', () => {
      const result = render(<ToolEditorToolbar />);
      expect(result.queryByTestId(settingsButtonId)).toBeNull();
      expect(result.queryByText('Publish')).toBeNull();
      expect(result.queryByText('Preview')).toBeNull();
    });
  });

  describe('valid tool', () => {
    const mockTool = {
      name: 'Tool',
    };

    beforeEach(() => {
      (useGetToolByIdQuery as jest.Mock).mockImplementation(() => ({
        data: mockTool,
      }));
    });

    it('renders title', () => {
      const result = render(<ToolEditorToolbar />);
      expect(result.getByText(mockTool.name)).toBeDefined();
    });

    it('renders settings icon button and focuses tool settings on click', async () => {
      const result = render(<ToolEditorToolbar />);

      const button = result.getByTestId(settingsButtonId);
      userEvent.click(button);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(focusToolSettings());
      });
    });

    it('renders Preview button', () => {
      const result = render(<ToolEditorToolbar />);
      expect(result.getByText('Preview')).toBeDefined();
    });

    it('renders Publish button', () => {
      const result = render(<ToolEditorToolbar />);
      expect(result.getByText('Publish')).toBeDefined();
    });
  });
});
