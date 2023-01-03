import { render } from '@testing-library/react';
import { PageContainer } from '../PageContainer';

describe('PageContainer', () => {
  it('renders children', () => {
    const mockChildren = 'children';
    const result = render(<PageContainer>{mockChildren}</PageContainer>);
    expect(result.getByText(mockChildren)).toBeDefined();
  });
});
