import { render } from '@testing-library/react';
import Error404 from '@app/pages/404';
import { BASE_WINDOW_URL } from '@tests/constants/window';

describe('Error404', () => {
  it('renders title and description text', () => {
    const result = render(<Error404 />);

    expect(result.getByText('Whoops!')).toBeTruthy();
    expect(
      result.getByText('It seems like the page you’re looking for is missing.')
    ).toBeTruthy();
  });

  it('renders button that navigates back to Home', () => {
    const result = render(<Error404 />);

    const button = result.getByText('Go back home');
    expect(button).toHaveProperty('href', `${BASE_WINDOW_URL}/`);
  });
});
