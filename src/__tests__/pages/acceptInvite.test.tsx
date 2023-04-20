import AcceptInvite from '@app/pages/acceptInvite';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';

describe('Accept Invite', () => {
  it('renders accept invite form', () => {
    render(<AcceptInvite />);
    expect(screen.getByTestId('accept-invite-form')).toBeTruthy();
  });
});
