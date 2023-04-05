import { render } from '@testing-library/react';
import { mockValidAddress } from '@tests/constants/data';
import { AddressTextField } from '../AddressTextField';

describe('AddressTextField', () => {
  it('renders value', () => {
    const mockValue = '123';
    const result = render(<AddressTextField value={mockValue} />);
    expect(result.getByDisplayValue(mockValue)).toBeTruthy();
  });

  it('renders "Invalid address" error if address is invalid', () => {
    const result = render(<AddressTextField value="123" />);
    expect(result.getByText('Invalid address')).toBeTruthy();
  });

  it('does not render "Invalid address" error if address is valid', () => {
    const result = render(<AddressTextField value={mockValidAddress} />);
    expect(result.queryByText('Invalid address')).toBeNull();
  });

  it('does not render "Invalid address" error if address is empty', () => {
    const result = render(<AddressTextField value="" />);
    expect(result.queryByText('Invalid address')).toBeNull();
  });
});
