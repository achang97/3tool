import { blurComponentFocus } from '@app/redux/features/editorSlice';
import { ComponentType, Tool } from '@app/types';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteComponentButton } from '../DeleteComponentButton';

const mockName = 'button1';

const mockTool: Tool = {
  id: '1',
  name: 'Tool',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  creator: { name: 'Andrew' },
  components: [
    {
      name: 'button1',
      type: ComponentType.Button,
      layout: {
        x: 1,
        y: 1,
        w: 1,
        h: 1,
      },
      metadata: {},
    },
  ],
};

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

describe('DeleteComponentButton', () => {
  const dialogId = 'delete-component-button-dialog';

  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateTool.mockReset();
  });

  it('renders Delete button', () => {
    const result = render(<DeleteComponentButton name={mockName} />);
    expect(result.getByText('Delete')).toBeDefined();
  });

  it('opens confirmation dialog on click', async () => {
    const result = render(<DeleteComponentButton name={mockName} />);

    await userEvent.click(result.getByText('Delete'));
    expect(result.getByTestId(dialogId)).toBeDefined();
  });

  it('closes confirmation dialog on Cancel click', async () => {
    const result = render(<DeleteComponentButton name={mockName} />);

    await userEvent.click(result.getByText('Delete'));
    expect(result.getByTestId(dialogId)).toBeDefined();

    await userEvent.click(result.getByText('Cancel'));
    await waitFor(() => {
      expect(result.queryByTestId(dialogId)).toBeNull();
      expect(mockUpdateTool).not.toHaveBeenCalled();
    });
  });

  it('successfully deletes component, blurs component focus, and closes dialog on Confirm click', async () => {
    mockUpdateTool.mockImplementation(() => ({ data: mockTool }));

    const result = render(<DeleteComponentButton name={mockName} />);

    await userEvent.click(result.getByText('Delete'));
    expect(result.getByTestId(dialogId)).toBeDefined();

    await userEvent.click(result.getByText('Confirm'));
    await waitFor(() => {
      expect(result.queryByTestId(dialogId)).toBeNull();
      expect(mockUpdateTool).toHaveBeenCalledWith({
        components: [],
      });
      expect(mockDispatch).toHaveBeenCalledWith(blurComponentFocus());
    });
  });

  it('fails to delete component, maintains component focus, and closes dialog on Confirm click', async () => {
    mockUpdateTool.mockImplementation(() => undefined);

    const result = render(<DeleteComponentButton name={mockName} />);

    await userEvent.click(result.getByText('Delete'));
    expect(result.getByTestId(dialogId)).toBeDefined();

    await userEvent.click(result.getByText('Confirm'));
    await waitFor(() => {
      expect(result.queryByTestId(dialogId)).toBeNull();
      expect(mockUpdateTool).toHaveBeenCalledWith({
        components: [],
      });
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });
});
