import userEvent from '@testing-library/user-event';
import { render } from '@tests/utils/renderWithContext';
import { Transformer } from '../Transformer';

const mockHandleChangeData = jest.fn();

jest.mock(
  '@app/components/editor/hooks/useCodeMirrorJavascriptAutocomplete',
  () => ({
    useCodeMirrorJavascriptAutocomplete: jest.fn(() => () => ({
      from: 0,
      options: [],
    })),
  })
);

describe('Transformer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders label', () => {
    const result = render(<Transformer onChangeData={mockHandleChangeData} />);
    expect(result.getByText('Transformer (JavaScript)')).toBeTruthy();
  });

  it('renders value', () => {
    const mockValue = 'value';
    const result = render(
      <Transformer value={mockValue} onChangeData={mockHandleChangeData} />
    );
    expect(result.getByText(mockValue)).toBeTruthy();
  });

  it('renders placeholder', () => {
    const result = render(<Transformer onChangeData={mockHandleChangeData} />);
    expect(
      result.getByText(
        'return formatDataAsArray(data).filter(row => row.quantity > 20)'
      )
    ).toBeTruthy();
  });

  it('calls onChangeData on value change', async () => {
    const mockValue = 'value';
    const result = render(<Transformer onChangeData={mockHandleChangeData} />);
    const input = result.getByRole('textbox');
    await userEvent.type(input, mockValue);
    expect(mockHandleChangeData).toHaveBeenCalledWith({
      transformer: mockValue,
    });
  });
});
