import { screen, render } from '@testing-library/react';
import { EmptyPlaceholder } from '../EmptyPlaceholder';

describe('EmptyPlaceholder', () => {
  it('renders children', () => {
    const mockChildren = 'children';
    render(<EmptyPlaceholder>{mockChildren}</EmptyPlaceholder>);
    expect(screen.getByText(mockChildren)).toBeTruthy();
  });
});
