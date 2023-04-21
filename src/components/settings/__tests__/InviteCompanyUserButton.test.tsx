import { screen, waitFor } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import userEvent from '@testing-library/user-event';
import { useSendCompanyInviteMutation } from '@app/redux/services/companies';
import { mockApiSuccessResponse, createMockApiErrorResponse } from '@tests/constants/api';
import { InviteCompanyUserButton } from '../InviteCompanyUserButton';

const mockEnqueueSnackbar = jest.fn();

jest.mock('@app/hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => mockEnqueueSnackbar),
}));

jest.mock('@app/redux/services/companies', () => ({
  __esModule: true,
  ...jest.requireActual('@app/redux/services/companies'),
  useSendCompanyInviteMutation: jest.fn(),
}));

const mockSendCompanyInvite = jest.fn();
const mockUseSendCompanyInviteMutation = jest.mocked(useSendCompanyInviteMutation);

describe('InviteCompanyUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSendCompanyInvite.mockImplementation(jest.fn(() => mockApiSuccessResponse) as jest.Mock);
    mockUseSendCompanyInviteMutation.mockImplementation(
      jest.fn(() => [mockSendCompanyInvite, { reset: jest.fn(), error: null }])
    );
  });

  it('renders Invite new user dialog only on "+ Invite user" button click', async () => {
    render(<InviteCompanyUserButton />);

    const openInviteDialogButton = screen.getByRole('button', { name: /invite user/i });
    expect(openInviteDialogButton).toBeVisible();
    expect(screen.queryByRole('dialog', { name: /invite new user/i })).not.toBeInTheDocument();

    await userEvent.click(openInviteDialogButton);

    expect(screen.getByRole('dialog', { name: /invite new user/i })).toBeVisible();
  });

  it('renders Invite new user dialog with correct description ', async () => {
    render(<InviteCompanyUserButton />);
    await userEvent.click(screen.getByRole('button', { name: /invite user/i }));

    const inviteDialog = screen.getByRole('dialog', { name: /invite new user/i });
    expect(inviteDialog).toHaveAccessibleDescription(
      /The user will receive an email to register and join the team workspace./i
    );
  });

  it('renders "User email" textfield in dialog which is empty by default ', async () => {
    render(<InviteCompanyUserButton />);
    await userEvent.click(screen.getByRole('button', { name: /invite user/i }));

    const emailTextbox = screen.getByRole('textbox', { name: /user email/i });
    expect(emailTextbox).toBeVisible();
    expect(emailTextbox).toHaveValue('');
  });

  it('renders "User role" select with correct options and "Editor" as default selected option ', async () => {
    render(<InviteCompanyUserButton />);
    await userEvent.click(screen.getByRole('button', { name: /invite user/i }));

    const userRoleSelect = screen.getByLabelText(/user role/i);
    expect(userRoleSelect).toHaveTextContent(/editor/i);

    await userEvent.click(userRoleSelect);
    expect(screen.getByRole('option', { name: /admin/i })).toBeVisible();
    expect(screen.getByRole('option', { name: /editor/i })).toBeVisible();
    expect(screen.getByRole('option', { name: /viewer/i })).toBeVisible();
  });

  it('enables "Send invite" button only after email textfield is non-empty', async () => {
    render(<InviteCompanyUserButton />);
    await userEvent.click(screen.getByRole('button', { name: /invite user/i }));

    const sendInviteButton = screen.getByRole('button', { name: /send invite/i });
    const emailTextbox = screen.getByRole('textbox', { name: /user email/i });

    expect(emailTextbox).toHaveValue('');
    expect(sendInviteButton).toBeDisabled();

    await userEvent.type(emailTextbox, 'example@gmail.com');

    expect(sendInviteButton).toBeEnabled();
  });

  describe('on "Send invite" button click', () => {
    const clickSendInviteButton = async () => {
      await userEvent.click(screen.getByRole('button', { name: /invite user/i }));
      await userEvent.type(
        screen.getByRole('textbox', { name: /user email/i }),
        'example@gmail.com'
      );
      await userEvent.click(screen.getByLabelText(/user role/i));
      await userEvent.click(screen.getByRole('option', { name: /viewer/i }));
      await userEvent.click(screen.getByRole('button', { name: /send invite/i }));
    };

    it('calls sendCompanyInvite function with correct params ', async () => {
      const [sendCompanyInvite] = mockUseSendCompanyInviteMutation();
      render(<InviteCompanyUserButton />);
      await clickSendInviteButton();

      expect(sendCompanyInvite).toHaveBeenCalledWith<Parameters<typeof sendCompanyInvite>>({
        email: 'example@gmail.com',
        roles: { isAdmin: false, isEditor: false, isViewer: true },
      });
    });

    it('If success, shows success snackbar and closes the invite dialog', async () => {
      mockSendCompanyInvite.mockImplementation(() => mockApiSuccessResponse);
      render(<InviteCompanyUserButton />);
      await clickSendInviteButton();

      expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Invited example@gmail.com', {
        variant: 'success',
      });
      waitFor(() =>
        expect(screen.queryByRole('dialog', { name: /invite new user/i })).not.toBeInTheDocument()
      );
    });

    it('If error, shows error message and keeps the invite dialog open', async () => {
      const error = new Error('Some error occurred');
      mockUseSendCompanyInviteMutation.mockImplementation(
        jest.fn(() => [createMockApiErrorResponse(error), { reset: jest.fn() }]) as jest.Mock
      );
      const { rerender } = render(<InviteCompanyUserButton />);

      expect(screen.queryByText(/some error occurred/i)).not.toBeInTheDocument();

      await clickSendInviteButton();
      // After user clicks on the SendInvite button and we receive reject response from API, then redux will set
      // the error object in MutationResult. Setting error in mockImplementation now and rerendering, to simulate
      // the same flow.
      mockUseSendCompanyInviteMutation.mockImplementation(
        jest.fn(() => [createMockApiErrorResponse(error), { reset: jest.fn(), error }]) as jest.Mock
      );
      rerender(<InviteCompanyUserButton />);

      expect(await screen.findByText(/some error occurred/i)).toBeVisible();
      expect(screen.getByRole('dialog', { name: /invite new user/i })).toBeVisible();
    });
  });
});
