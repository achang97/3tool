import { useActionFocusedState } from '@app/components/editor/hooks/useActionFocusedState';
import { ActionType } from '@app/types';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SaveRunButton } from '../SaveRunButton';

const mockSaveAction = jest.fn();
const mockExecuteAction = jest.fn();
const mockSaveAndExecuteAction = jest.fn();

jest.mock('@app/components/editor/hooks/useActionFocusedState');

jest.mock('@app/components/editor/hooks/useActionSaveHandlers', () => ({
  useActionSaveHandlers: jest.fn(() => ({
    saveAction: mockSaveAction,
    executeAction: mockExecuteAction,
    saveAndExecuteAction: mockSaveAndExecuteAction,
  })),
}));

describe('SaveRunButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('run', () => {
    beforeEach(() => {
      (useActionFocusedState as jest.Mock).mockImplementation(() => ({ isEditing: false }));
    });

    it('displays "Run" text if not editing', () => {
      render(<SaveRunButton type={ActionType.Javascript} />);
      expect(screen.getByText('Run')).toBeTruthy();
    });

    it('executes action on click', async () => {
      render(<SaveRunButton type={ActionType.Javascript} />);
      await userEvent.click(screen.getByText('Run'));
      expect(mockExecuteAction).toHaveBeenCalled();
    });
  });

  describe('save', () => {
    beforeEach(() => {
      (useActionFocusedState as jest.Mock).mockImplementation(() => ({ isEditing: true }));
    });

    it('displays "Save" text if editing and in write mode', () => {
      render(<SaveRunButton type={ActionType.Javascript} />);
      expect(screen.getByText('Save')).toBeTruthy();
    });

    it('saves action on click', async () => {
      render(<SaveRunButton type={ActionType.Javascript} />);
      await userEvent.click(screen.getByText('Save'));
      expect(mockSaveAction).toHaveBeenCalled();
    });
  });

  describe('save & run', () => {
    beforeEach(() => {
      (useActionFocusedState as jest.Mock).mockImplementation(() => ({ isEditing: true }));
    });

    it('displays "Save & Run" text if editing and in read mode', () => {
      render(<SaveRunButton type={ActionType.SmartContractRead} />);
      expect(screen.getByText('Save & Run')).toBeTruthy();
    });

    it('saves and executes action on click', async () => {
      render(<SaveRunButton type={ActionType.SmartContractRead} />);
      await userEvent.click(screen.getByText('Save & Run'));
      expect(mockSaveAndExecuteAction).toHaveBeenCalled();
    });
  });

  describe('loading', () => {
    it('renders disabled button if loading', () => {
      (useActionFocusedState as jest.Mock).mockImplementation(() => ({ isLoading: true }));
      render(<SaveRunButton type={ActionType.SmartContractRead} />);
      expect(screen.getByTestId('save-run-button')).toBeDisabled();
    });
  });
});
