import { render } from '@testing-library/react';
import { AbiTextField } from '../AbiTextField';

describe('AbiTextField', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders given value in input', () => {
    const mockValue = 'test';
    const result = render(<AbiTextField value={mockValue} />);
    expect(result.getByText(mockValue)).toBeDefined();
  });

  it('renders error if value is not JSON', () => {
    const mockValue = '[';
    const result = render(<AbiTextField value={mockValue} />);
    expect(result.getByText('Invalid JSON')).toBeDefined();
  });

  it('does not render error if value is empty', () => {
    const mockValue = '';
    const result = render(<AbiTextField value={mockValue} />);
    expect(result.queryByText('Invalid JSON')).toBeNull();
  });

  it('does not render error if value is valid JSON', () => {
    const mockValue = '[]';
    const result = render(<AbiTextField value={mockValue} />);
    expect(result.queryByText('Invalid JSON')).toBeNull();
  });
});
