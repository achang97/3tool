import { MenuItem } from '@mui/material';
import { screen, render } from '@testing-library/react';
import { Select } from '../Select';

const mockValue = '1';
const mockChildren = <MenuItem value={mockValue}>1</MenuItem>;
const mockPlaceholder = 'placeholder';

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useTheme: jest.fn(() => ({ opacity: { inputPlaceholder: '' } })),
}));

describe('Select', () => {
  it('renders placeholder', () => {
    render(
      <Select placeholder={mockPlaceholder} value="">
        {mockChildren}
      </Select>
    );
    expect(screen.getByText(mockPlaceholder)).toBeTruthy();
  });

  it('renders value', () => {
    render(
      <Select value={mockValue} placeholder={mockPlaceholder}>
        {mockChildren}
      </Select>
    );
    expect(screen.getByTestId('select')).toHaveValue(mockValue);
    expect(screen.queryByTestId(mockPlaceholder)).toBeNull();
  });
});
