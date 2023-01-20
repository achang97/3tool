import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { focusToolSettings } from '@app/redux/features/editorSlice';
import { useGetActiveTool } from '@app/components/editor/hooks/useGetActiveTool';
import { ToolEditorToolbar } from '../ToolEditorToolbar';

const mockDispatch = jest.fn();
const mockUpdateTool = jest.fn();

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

jest.mock('@app/components/editor/hooks/useGetActiveTool');
jest.mock('@app/components/editor/hooks/useUpdateActiveTool', () => ({
  useUpdateActiveTool: jest.fn(() => mockUpdateTool),
}));

describe('ToolEditorToolbar', () => {
  const settingsButtonId = 'tool-editor-toolbar-settings-button';

  beforeEach(() => {
    jest.clearAllMocks();
    (useGetActiveTool as jest.Mock).mockImplementation(() => undefined);
  });

  describe('invalid tool', () => {
    beforeEach(() => {
      (useGetActiveTool as jest.Mock).mockImplementation(() => undefined);
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
      id: 'tool-id',
      name: 'Tool',
    };

    beforeEach(() => {
      (useGetActiveTool as jest.Mock).mockImplementation(() => mockTool);
    });

    it('renders name and toggles input to update value', async () => {
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
    });

    it('renders settings icon button and focuses tool settings on click', async () => {
      const result = render(<ToolEditorToolbar />);

      const button = result.getByTestId(settingsButtonId);
      await userEvent.click(button);

      expect(mockDispatch).toHaveBeenCalledWith(focusToolSettings());
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
