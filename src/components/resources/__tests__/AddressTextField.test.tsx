import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddressTextField } from '../AddressTextField';

const mockHandleChange = jest.fn();

describe('AddressTextField', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders given value in input', () => {
    const mockValue = 'test';
    const result = render(
      <AddressTextField value={mockValue} onChange={mockHandleChange} />
    );

    const input = result.getByRole('textbox');
    expect(input).toHaveProperty('value', mockValue);
  });

  it('renders error if value is not valid address', () => {
    const mockValue = '0x';
    const result = render(
      <AddressTextField value={mockValue} onChange={mockHandleChange} />
    );
    expect(result.getByText('Invalid address')).toBeDefined();
  });

  it('renders error if value is valid address and fetchAbiError is defined', () => {
    const mockValue = '0xf33Cb58287017175CADf990c9e4733823704aA86';
    const mockFetchAbiError = 'Some error';

    const result = render(
      <AddressTextField
        value={mockValue}
        onChange={mockHandleChange}
        fetchAbiError={mockFetchAbiError}
      />
    );
    expect(result.getByText(mockFetchAbiError)).toBeDefined();
  });

  it('does not render error if value is empty', () => {
    const mockValue = '';
    const result = render(
      <AddressTextField value={mockValue} onChange={mockHandleChange} />
    );
    expect(result.queryByText('Invalid address')).toBeNull();
  });

  it('does not render error if value is valid address', () => {
    const mockValue = '0xf33Cb58287017175CADf990c9e4733823704aA86';
    const result = render(
      <AddressTextField value={mockValue} onChange={mockHandleChange} />
    );
    expect(result.queryByText('Invalid address')).toBeNull();
  });

  it('calls onChange', async () => {
    const result = render(
      <AddressTextField value="" onChange={mockHandleChange} />
    );

    const mockValue = 'a';
    const input = result.getByRole('textbox');
    userEvent.type(input, mockValue);

    await waitFor(() => {
      expect(mockHandleChange).toHaveBeenCalledWith(mockValue);
    });
  });
});
