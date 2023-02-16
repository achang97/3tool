import { render } from '@testing-library/react';
import { EmptyPlaceholder } from '../EmptyPlaceholder';

describe('EmptyPlaceholder', () => {
  it('renders children', () => {
    const mockChildren = 'children';
    const result = render(<EmptyPlaceholder>{mockChildren}</EmptyPlaceholder>);
    expect(result.getByText(mockChildren)).toBeTruthy();
  });
});
