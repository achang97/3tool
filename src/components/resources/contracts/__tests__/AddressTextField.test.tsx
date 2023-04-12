import { screen, render } from '@testing-library/react';
import { mockValidAddress } from '@tests/constants/data';
import { AddressTextField } from '../AddressTextField';

describe('AddressTextField', () => {
  it('renders value', () => {
    const mockValue = '123';
    render(<AddressTextField value={mockValue} />);
    expect(screen.getByDisplayValue(mockValue)).toBeTruthy();
  });

  it('renders "Invalid address" error if address is invalid', () => {
    render(<AddressTextField value="123" />);
    expect(screen.getByText('Invalid address')).toBeTruthy();
  });

  it('does not render "Invalid address" error if address is valid', () => {
    render(<AddressTextField value={mockValidAddress} />);
    expect(screen.queryByText('Invalid address')).toBeNull();
  });

  it('does not render "Invalid address" error if address is empty', () => {
    render(<AddressTextField value="" />);
    expect(screen.queryByText('Invalid address')).toBeNull();
  });
});
