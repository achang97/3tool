import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AbiTextField } from '../AbiTextField';

const mockHandleChange = jest.fn();

describe('AbiTextField', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders given value in input', () => {
    const mockValue = 'test';
    const result = render(
      <AbiTextField value={mockValue} onChange={mockHandleChange} />
    );
    expect(result.getByText(mockValue)).toBeDefined();
  });

  it('renders error if value is not JSON', () => {
    const mockValue = '[';
    const result = render(
      <AbiTextField value={mockValue} onChange={mockHandleChange} />
    );
    expect(result.getByText('Invalid JSON')).toBeDefined();
  });

  it('does not render error if value is empty', () => {
    const mockValue = '';
    const result = render(
      <AbiTextField value={mockValue} onChange={mockHandleChange} />
    );
    expect(result.queryByText('Invalid JSON')).toBeNull();
  });

  it('does not render error if value is valid JSON', () => {
    const mockValue = '[]';
    const result = render(
      <AbiTextField value={mockValue} onChange={mockHandleChange} />
    );
    expect(result.queryByText('Invalid JSON')).toBeNull();
  });

  it('calls onChange', async () => {
    const result = render(
      <AbiTextField value="" onChange={mockHandleChange} />
    );

    const mockValue = 'a';
    const input = result.getByRole('textbox');
    userEvent.type(input, mockValue);

    await waitFor(() => {
      expect(mockHandleChange).toHaveBeenCalledWith(mockValue);
    });
  });
});
