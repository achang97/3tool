import { render } from '@testing-library/react';
import Error404 from '@app/pages/404';

describe('Error404', () => {
  it('renders title and description text', () => {
    const result = render(<Error404 />);

    expect(result.getByText('Whoops!')).toBeDefined();
    expect(
      result.getByText('It seems like the page you’re looking for is missing.')
    ).toBeDefined();
  });

  it('renders button that navigates back to Home', () => {
    const result = render(<Error404 />);

    const button = result.getByText('Go back home');
    expect(button).toHaveProperty('href', 'http://localhost/');
  });
});
