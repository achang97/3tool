import { screen, render } from '@testing-library/react';
import { DataGridPlaceholder } from '../DataGridPlaceholder';

describe('DataGridPlaceholder', () => {
  it('renders children', () => {
    const mockChildren = 'test';
    render(<DataGridPlaceholder>{mockChildren}</DataGridPlaceholder>);
    expect(screen.getByText(mockChildren)).toBeTruthy();
  });
});
