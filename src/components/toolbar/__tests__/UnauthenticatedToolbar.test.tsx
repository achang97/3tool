import { screen, render } from '@testing-library/react';
import { UnauthenticatedToolbar } from '../UnauthenticatedToolbar';

describe('UnauthenticatedToolbar', () => {
  it('renders logo as a link to /', () => {
    render(<UnauthenticatedToolbar />);

    const logo = screen.getByTestId('toolbar-logo');
    expect(logo.getAttribute('href')).toEqual('/');
  });
});
