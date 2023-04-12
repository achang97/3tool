import userEvent from '@testing-library/user-event';
import { screen, render } from '@testing-library/react';
import { focusToolSettings, setIsPreview } from '@app/redux/features/editorSlice';
import { mockTool } from '@tests/constants/data';
import { useAppSelector } from '@app/redux/hooks';
import { ToolEditorToolbar } from '../ToolEditorToolbar';

const mockDispatch = jest.fn();
const mockUpdateTool = jest.fn();
const mockReload = jest.fn();

jest.mock('@app/redux/hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(() => mockDispatch),
}));

jest.mock('@app/components/editor/hooks/useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: mockTool,
    updateTool: mockUpdateTool,
  })),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    reload: mockReload,
  })),
}));

describe('ToolEditorToolbar', () => {
  const settingsButtonId = 'tool-editor-toolbar-settings-button';

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation(() => ({}));
  });

  describe('edit name', () => {
    it('renders name', () => {
      render(<ToolEditorToolbar />);
      expect(screen.getByText(mockTool.name)).toBeTruthy();
    });

    it('toggles editable input and updates name', async () => {
      render(<ToolEditorToolbar />);

      await userEvent.click(screen.getByText(mockTool.name));
      await screen.findByTestId('editable-text-field-edit');

      const newNameText = '1234';
      await userEvent.keyboard(newNameText);
      await userEvent.keyboard('[Enter]');

      expect(mockUpdateTool).toHaveBeenCalledWith({
        name: `${mockTool.name}${newNameText}`,
      });
    });
  });

  it('renders settings icon button and focuses tool settings on click', async () => {
    render(<ToolEditorToolbar />);

    const button = screen.getByTestId(settingsButtonId);
    await userEvent.click(button);

    expect(mockDispatch).toHaveBeenCalledWith(focusToolSettings());
  });

  it('renders Preview button that toggles preview', async () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      isPreview: false,
    }));
    render(<ToolEditorToolbar />);

    await userEvent.click(screen.getByText('Preview'));
    expect(mockDispatch).toHaveBeenCalledWith(setIsPreview(true));
  });

  it('renders Editor button that toggles editor', async () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      isPreview: true,
    }));
    render(<ToolEditorToolbar />);

    await userEvent.click(screen.getByText('Editor'));
    expect(mockDispatch).toHaveBeenCalledWith(setIsPreview(false));
  });
});
