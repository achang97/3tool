import { useActionIsEditing } from '@app/components/editor/hooks/useActionIsEditing';
import { ActionType } from '@app/types';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SaveRunButton } from '../SaveRunButton';

const mockSaveAction = jest.fn();
const mockExecuteAction = jest.fn();
const mockSaveAndExecuteAction = jest.fn();

jest.mock('@app/components/editor/hooks/useActionIsEditing');

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
      (useActionIsEditing as jest.Mock).mockImplementation(() => false);
    });

    it('displays "Run" text if not editing', () => {
      const result = render(<SaveRunButton type={ActionType.Javascript} />);
      expect(result.getByText('Run')).toBeTruthy();
    });

    it('executes action on click', async () => {
      const result = render(<SaveRunButton type={ActionType.Javascript} />);
      await userEvent.click(result.getByText('Run'));
      expect(mockExecuteAction).toHaveBeenCalled();
    });
  });

  describe('save', () => {
    beforeEach(() => {
      (useActionIsEditing as jest.Mock).mockImplementation(() => true);
    });

    it('displays "Save" text if editing and in write mode', () => {
      const result = render(<SaveRunButton type={ActionType.Javascript} />);
      expect(result.getByText('Save')).toBeTruthy();
    });

    it('saves action on click', async () => {
      const result = render(<SaveRunButton type={ActionType.Javascript} />);
      await userEvent.click(result.getByText('Save'));
      expect(mockSaveAction).toHaveBeenCalled();
    });
  });

  describe('save & run', () => {
    beforeEach(() => {
      (useActionIsEditing as jest.Mock).mockImplementation(() => true);
    });

    it('displays "Save & Run" text if editing and in read mode', () => {
      const result = render(
        <SaveRunButton type={ActionType.SmartContractRead} />
      );
      expect(result.getByText('Save & Run')).toBeTruthy();
    });

    it('saves and executes action on click', async () => {
      const result = render(
        <SaveRunButton type={ActionType.SmartContractRead} />
      );
      await userEvent.click(result.getByText('Save & Run'));
      expect(mockSaveAndExecuteAction).toHaveBeenCalled();
    });
  });
});
