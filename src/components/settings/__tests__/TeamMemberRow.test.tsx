import { render } from '@tests/utils/renderWithContext';
import { screen } from '@testing-library/react';
import { TeamMemberRow } from '../TeamMemberRow';

describe('TeamMemberRow', () => {
  it('renders TeamMemberRow with children received from props', async () => {
    render(<TeamMemberRow>some children</TeamMemberRow>);

    expect(screen.getByText(/some children/i)).toBeVisible();
  });
});
