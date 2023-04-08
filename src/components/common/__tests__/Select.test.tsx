import { MenuItem } from '@mui/material';
import { render } from '@testing-library/react';
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
    const result = render(
      <Select placeholder={mockPlaceholder} value="">
        {mockChildren}
      </Select>
    );
    expect(result.getByText(mockPlaceholder)).toBeTruthy();
  });

  it('renders value', () => {
    const result = render(
      <Select value={mockValue} placeholder={mockPlaceholder}>
        {mockChildren}
      </Select>
    );
    expect(result.getByTestId('select')).toHaveValue(mockValue);
    expect(result.queryByTestId(mockPlaceholder)).toBeNull();
  });
});
