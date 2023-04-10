import userEvent from '@testing-library/user-event';
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
    const result = render(<Transformer onDataChange={mockHandleDataChange} />);
    expect(result.getByText('Transformer (JavaScript)')).toBeTruthy();
  });

  it('renders value', () => {
    const mockValue = 'value';
    const result = render(<Transformer value={mockValue} onDataChange={mockHandleDataChange} />);
    expect(result.getByText(mockValue)).toBeTruthy();
  });

  it('renders placeholder', () => {
    const result = render(<Transformer onDataChange={mockHandleDataChange} />);
    expect(
      result.getByText('return formatDataAsArray(data).filter(row => row.quantity > 20)')
    ).toBeTruthy();
  });

  it('calls onDataChange on value change', async () => {
    const mockValue = 'value';
    const result = render(<Transformer onDataChange={mockHandleDataChange} />);
    const input = result.getByRole('textbox');
    await userEvent.type(input, mockValue);
    expect(mockHandleDataChange).toHaveBeenCalledWith({
      transformer: mockValue,
    });
  });
});
