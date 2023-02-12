import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { focusToolSettings } from '@app/redux/features/editorSlice';
import {
  mockApiErrorResponse,
  mockApiSuccessResponse,
} from '@tests/constants/api';
import { mockTool } from '@tests/constants/data';
import { BASE_WINDOW_URL } from '@tests/constants/window';
import { ToolEditorToolbar } from '../ToolEditorToolbar';

const mockDispatch = jest.fn();
const mockUpdateTool = jest.fn();
const mockReload = jest.fn();

jest.mock('@app/redux/hooks', () => ({
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
  });

  describe('edit name', () => {
    it('renders name', () => {
      const result = render(<ToolEditorToolbar />);
      expect(result.getByText(mockTool.name)).toBeTruthy();
    });

    it('toggles editable input and refreshes window if name update succeeds', async () => {
      mockUpdateTool.mockImplementation(jest.fn(() => mockApiSuccessResponse));

      const result = render(<ToolEditorToolbar />);

      await userEvent.click(result.getByText(mockTool.name));
      await result.findByTestId('editable-text-field-edit');

      const newNameText = '1234';
      await userEvent.keyboard(newNameText);
      await userEvent.keyboard('[Enter]');

      expect(mockUpdateTool).toHaveBeenCalledWith({
        name: `${mockTool.name}${newNameText}`,
      });

      await result.findByTestId('editable-text-field-view');
      expect(mockReload).toHaveBeenCalled();
    });

    it('toggles editable input and does not refresh window if name update fails', async () => {
      mockUpdateTool.mockImplementation(jest.fn(() => mockApiErrorResponse));

      const result = render(<ToolEditorToolbar />);

      await userEvent.click(result.getByText(mockTool.name));
      await result.findByTestId('editable-text-field-edit');

      const newNameText = '1234';
      await userEvent.keyboard(newNameText);
      await userEvent.keyboard('[Enter]');

      expect(mockUpdateTool).toHaveBeenCalledWith({
        name: `${mockTool.name}${newNameText}`,
      });

      await result.findByTestId('editable-text-field-view');
      expect(mockReload).not.toHaveBeenCalled();
    });
  });

  it('renders settings icon button and focuses tool settings on click', async () => {
    const result = render(<ToolEditorToolbar />);

    const button = result.getByTestId(settingsButtonId);
    await userEvent.click(button);

    expect(mockDispatch).toHaveBeenCalledWith(focusToolSettings());
  });

  it('renders Preview button that links to tool page', () => {
    const result = render(<ToolEditorToolbar />);

    const previewButton = result.getByText('Preview');
    expect(previewButton).toHaveProperty(
      'href',
      `${BASE_WINDOW_URL}/tools/${mockTool.id}`
    );
  });
});
