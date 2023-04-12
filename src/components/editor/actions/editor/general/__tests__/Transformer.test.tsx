import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import { Transformer } from '../Transformer';

const mockHandleDataChange = jest.fn();

jest.mock('@app/components/editor/hooks/useCodeMirrorJavascriptAutocomplete', () => ({
  useCodeMirrorJavascriptAutocomplete: jest.fn(() => () => ({
    from: 0,
    options: [],
  })),
}));

describe('Transformer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders label', () => {
    render(<Transformer onDataChange={mockHandleDataChange} />);
    expect(screen.getByText('Transformer (JavaScript)')).toBeTruthy();
  });

  it('renders value', () => {
    const mockValue = 'value';
    render(<Transformer value={mockValue} onDataChange={mockHandleDataChange} />);
    expect(screen.getByText(mockValue)).toBeTruthy();
  });

  it('renders placeholder', () => {
    render(<Transformer onDataChange={mockHandleDataChange} />);
    expect(
      screen.getByText('return formatDataAsArray(data).filter(row => row.quantity > 20)')
    ).toBeTruthy();
  });

  it('calls onDataChange on value change', async () => {
    const mockValue = 'value';
    render(<Transformer onDataChange={mockHandleDataChange} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, mockValue);
    expect(mockHandleDataChange).toHaveBeenCalledWith({
      transformer: mockValue,
    });
  });
});
