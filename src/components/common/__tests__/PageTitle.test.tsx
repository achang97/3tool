import { render } from '@testing-library/react';
import { PageTitle } from '../PageTitle';

describe('PageTitle', () => {
  it('renders children', () => {
    const mockTitle = 'Title';
    const result = render(<PageTitle>{mockTitle}</PageTitle>);
    expect(result.getByText(mockTitle)).toBeDefined();
  });
});
