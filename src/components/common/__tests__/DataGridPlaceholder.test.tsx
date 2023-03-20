import { render } from '@testing-library/react';
import { DataGridPlaceholder } from '../DataGridPlaceholder';

describe('DataGridPlaceholder', () => {
  it('renders children', () => {
    const mockChildren = 'test';
    const result = render(
      <DataGridPlaceholder>{mockChildren}</DataGridPlaceholder>
    );
    expect(result.getByText(mockChildren)).toBeTruthy();
  });
});
