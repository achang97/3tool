import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import { mockApiError } from '@tests/constants/api';
import { textContentMatcher } from '@tests/utils/testingLibraryCustomMatchers';
import { BaseDeleteDialog, BaseDeleteDialogProps } from '../BaseDeleteDialog';

const mockHandleClose = jest.fn();
const mockHandleDeleteResource = jest.fn();

const setup = (propOverrides?: Partial<BaseDeleteDialogProps>) => {
  const props: BaseDeleteDialogProps = {
    entityType: 'resource',
    entityName: 'Staking Pool API',
    isOpen: true,
    isLoading: false,
    error: undefined,
    showConfirmation: false,
    onClose: mockHandleClose,
    onDelete: mockHandleDeleteResource,
    ...propOverrides,
  };

  return render(<BaseDeleteDialog {...props} />);
};

describe('BaseDeleteDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isOpen', () => {
    it('renders dialog if isOpen is true', () => {
      setup({ isOpen: true });

      expect(screen.getByRole('dialog', { name: /delete resource/i })).toBeVisible();
      expect(
        screen.getByText(/are you sure you want to permanently delete this resource\?/i)
      ).toBeVisible();
    });

    it('does not render dialog if isOpen is false', () => {
      setup({ isOpen: false });

      expect(screen.queryByRole('dialog', { name: /delete resource/i })).not.toBeInTheDocument();
      expect(
        screen.queryByText(/are you sure you want to permanently delete this resource\?/i)
      ).not.toBeInTheDocument();
    });
  });

  it('renders entityType in title and dialog content', () => {
    setup({ entityType: 'app' });

    expect(screen.getByRole('dialog', { name: /delete app/i })).toBeVisible();
    expect(
      screen.getByText(/are you sure you want to permanently delete this app\?/i)
    ).toBeVisible();
  });

  it('renders action buttons ', () => {
    setup();

    expect(screen.getByRole('button', { name: /no, cancel/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /yes, delete it\./i })).toBeVisible();
  });

  describe('customBody', () => {
    it('renders default body if customBody prop is not passed', () => {
      setup({ customBody: undefined });

      expect(
        screen.getByText(
          textContentMatcher(
            /once staking pool api is deleted, you will not be able to recover its information\./i
          )
        )
      ).toBeVisible();
    });

    it('renders custom body if customBody prop is passed', () => {
      setup({ customBody: <div>Custom body</div> });

      expect(screen.getByText(/custom body/i)).toBeVisible();
    });
  });

  describe('showConfirmation prop false', () => {
    it('renders enabled "Yes, delete it" button and does not render "Confirm resource name" textbox', () => {
      setup({ showConfirmation: false });

      expect(
        screen.queryByRole('textbox', {
          name: /type the name of the resource to confirm deletion/i,
        })
      ).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /yes, delete it\./i })).toBeEnabled();
    });
  });

  describe('showConfirmation prop true', () => {
    it('renders an empty confirmation textbox and a disabled "Yes, delete it" button', () => {
      setup({ showConfirmation: true });

      const confirmResourceNameTextbox = screen.getByRole('textbox', {
        name: /type the name of the resource to confirm deletion/i,
      });
      expect(confirmResourceNameTextbox).toBeVisible();
      expect(confirmResourceNameTextbox).toHaveValue('');
      expect(screen.getByRole('button', { name: /yes, delete it\./i })).toBeDisabled();
    });

    it('displays error on confirmation textbox if incorrect resource name is entered in it', async () => {
      setup({ showConfirmation: true });

      expect(screen.queryByText(/resource name is not correct/i)).not.toBeInTheDocument();
      await userEvent.type(
        screen.getByRole('textbox', { name: /type the name of the resource to confirm deletion/i }),
        'some different name'
      );

      expect(screen.getByText(/resource name is not correct/i)).toBeVisible();
      expect(screen.getByRole('button', { name: /yes, delete it\./i })).toBeDisabled();
    });

    it('enables "Yes, delete it" button only when correct resource name is entered in confirmation textbox', async () => {
      setup({ showConfirmation: true });

      expect(screen.getByRole('button', { name: /yes, delete it\./i })).toBeDisabled();

      await userEvent.type(
        screen.getByRole('textbox', { name: /type the name of the resource to confirm deletion/i }),
        'Staking Pool API'
      );

      expect(screen.queryByText(/resource name is not correct/i)).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /yes, delete it\./i })).toBeEnabled();
    });
  });

  describe('Action button click', () => {
    it('calls onClose on "No, cancel" button click', async () => {
      setup();

      expect(mockHandleClose).not.toHaveBeenCalled();

      await userEvent.click(screen.getByRole('button', { name: /no, cancel/i }));

      expect(mockHandleClose).toHaveBeenCalled();
    });

    it('calls onClose on successful entity deletion', async () => {
      const mockOnDelete = jest.fn(() => Promise.resolve());
      setup({ onDelete: mockOnDelete });

      await userEvent.click(screen.getByRole('button', { name: /yes, delete it\./i }));

      expect(mockOnDelete).toHaveBeenCalled();
      expect(mockHandleClose).toHaveBeenCalled();
    });

    it('does not call onClose on failed resource deletion', async () => {
      const mockOnDelete = jest.fn(() => Promise.reject());
      setup({ onDelete: mockOnDelete });

      await userEvent.click(screen.getByRole('button', { name: /yes, delete it\./i }));

      expect(mockOnDelete).toHaveBeenCalledWith();
      expect(mockHandleClose).not.toHaveBeenCalled();
    });
  });

  it('renders loader on "Yes, delete it" button if isLoading prop is true', () => {
    setup({ isLoading: true });

    expect(screen.getByRole('progressbar', { name: /yes, delete it\./i })).toBeVisible();
    expect(screen.getByRole('button', { name: /yes, delete it\./i })).toBeDisabled();
  });

  it('renders API error message if error prop is passed', () => {
    setup({ error: mockApiError });

    expect(screen.getByText(new RegExp(mockApiError.data.message, 'i'))).toBeVisible();
  });
});
