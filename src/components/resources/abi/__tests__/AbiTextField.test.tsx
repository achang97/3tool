import { screen, render } from '@testing-library/react';
import { AbiTextField } from '../AbiTextField';

describe('AbiTextField', () => {
  it('renders value', () => {
    const mockValue = '[]';
    render(<AbiTextField value={mockValue} />);
    expect(screen.getByDisplayValue(mockValue)).toBeTruthy();
  });

  it('renders "Invalid JSON" error if ABI is invalid', () => {
    render(<AbiTextField value="[" />);
    expect(screen.getByText('Invalid JSON')).toBeTruthy();
  });

  it('does not render "Invalid JSON" error if ABI is valid', () => {
    render(<AbiTextField value="[]" />);
    expect(screen.queryByText('Invalid JSON')).toBeNull();
  });

  it('does not render "Invalid JSON" error if ABI is empty', () => {
    render(<AbiTextField value="" />);
    expect(screen.queryByText('Invalid JSON')).toBeNull();
  });
});
