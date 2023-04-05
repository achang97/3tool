import { render } from '@testing-library/react';
import { AbiTextField } from '../AbiTextField';

describe('AbiTextField', () => {
  it('renders value', () => {
    const mockValue = '[]';
    const result = render(<AbiTextField value={mockValue} />);
    expect(result.getByDisplayValue(mockValue)).toBeTruthy();
  });

  it('renders "Invalid JSON" error if ABI is invalid', () => {
    const result = render(<AbiTextField value="[" />);
    expect(result.getByText('Invalid JSON')).toBeTruthy();
  });

  it('does not render "Invalid JSON" error if ABI is valid', () => {
    const result = render(<AbiTextField value="[]" />);
    expect(result.queryByText('Invalid JSON')).toBeNull();
  });

  it('does not render "Invalid JSON" error if ABI is empty', () => {
    const result = render(<AbiTextField value="" />);
    expect(result.queryByText('Invalid JSON')).toBeNull();
  });
});
