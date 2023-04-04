import { render } from '@testing-library/react';
import { UnauthenticatedToolbar } from '../UnauthenticatedToolbar';

describe('UnauthenticatedToolbar', () => {
  it('renders logo as a link to /', () => {
    const result = render(<UnauthenticatedToolbar />);

    const logo = result.getByTestId('toolbar-logo');
    expect(logo.getAttribute('href')).toEqual('/');
  });
});
