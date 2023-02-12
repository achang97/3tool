import { snippetCompletion } from '@codemirror/autocomplete';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { replaceSpecialChars } from '@tests/utils/userEvent';
import { useDynamicTextFieldAutocomplete } from '../../hooks/useDynamicTextFieldAutocomplete';
import { EvalResult } from '../../utils/eval';
import { DynamicTextField } from '../DynamicTextField';

const mockHandleChange = jest.fn();

const mockLabel = 'Label';
const mockEvalResult: EvalResult = {};
const mockPreview = {
  alertType: 'success',
  type: 'number',
  message: '4',
};

jest.mock('../../hooks/useDynamicTextFieldPreview', () => ({
  useDynamicTextFieldPreview: jest.fn(() => mockPreview),
}));

jest.mock('../../hooks/useDynamicTextFieldAutocomplete', () => ({
  useDynamicTextFieldAutocomplete: jest.fn(() => ({ from: 0, options: [] })),
}));

describe('DynamicTextField', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders label', () => {
    const result = render(
      <DynamicTextField
        label={mockLabel}
        evalResult={mockEvalResult}
        onChange={mockHandleChange}
      />
    );
    expect(result.getByText(mockLabel)).toBeTruthy();
  });

  it('calls onChange on input change', async () => {
    const result = render(
      <DynamicTextField
        label={mockLabel}
        evalResult={mockEvalResult}
        onChange={mockHandleChange}
      />
    );

    const newValue = 'h';

    const input = result.getByRole('textbox');
    await userEvent.type(input, newValue);

    expect(mockHandleChange).toHaveBeenCalledWith(newValue, expect.any(Object));
  });

  it('sets initial input value to value prop', () => {
    const mockValue = 'hello';

    const result = render(
      <DynamicTextField
        label={mockLabel}
        value={mockValue}
        evalResult={mockEvalResult}
        onChange={mockHandleChange}
      />
    );

    expect(result.getByText(mockValue)).toBeTruthy();
  });

  it('does not update input value to match value prop', () => {
    const mockValue = 'hello';
    const mockNewValue = 'hello world!';

    const result = render(
      <DynamicTextField
        label={mockLabel}
        value={mockValue}
        evalResult={mockEvalResult}
        onChange={mockHandleChange}
      />
    );

    expect(result.getByText(mockValue)).toBeTruthy();

    result.rerender(
      <DynamicTextField
        label={mockLabel}
        value={mockNewValue}
        evalResult={mockEvalResult}
        onChange={mockHandleChange}
      />
    );

    expect(result.getByText(mockValue)).toBeTruthy();
    expect(result.queryByText(mockNewValue)).toBeNull();
  });

  it('renders preview when input is focused', async () => {
    const result = render(
      <DynamicTextField
        label={mockLabel}
        evalResult={mockEvalResult}
        onChange={mockHandleChange}
      />
    );

    await userEvent.click(result.getByRole('textbox'));

    expect(result.getByText(mockPreview.type)).toBeTruthy();
    expect(result.getByText(mockPreview.message)).toBeTruthy();
  });

  it('does not render preview when input is not focused', () => {
    const result = render(
      <DynamicTextField
        label={mockLabel}
        evalResult={mockEvalResult}
        onChange={mockHandleChange}
      />
    );

    expect(result.queryByText(mockPreview.type)).toBeNull();
    expect(result.queryByText(mockPreview.message)).toBeNull();
  });

  it('successfully renders correct options for autocomplete and autofills on click', async () => {
    const mockAutocompleteOptions = [
      snippetCompletion('someFunctionOne#{1}', {
        label: 'someFunctionOne',
      }),
      snippetCompletion('someFunctionTwo#{1}', {
        label: 'someFunctionTwo',
      }),
      snippetCompletion('ignored#{1}', {
        label: 'ignored',
      }),
    ];
    (useDynamicTextFieldAutocomplete as jest.Mock).mockImplementation(() => {
      return () => ({
        from: 2,
        options: mockAutocompleteOptions,
      });
    });

    const result = render(
      <DynamicTextField
        label={mockLabel}
        evalResult={mockEvalResult}
        onChange={mockHandleChange}
      />
    );

    const input = result.getByRole('textbox');
    await userEvent.type(input, replaceSpecialChars('{{someFunction'));

    const options = await result.findAllByRole('option');
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent('someFunctionOne');
    expect(options[1]).toHaveTextContent('someFunctionTwo');

    await userEvent.click(options[0]);
    expect(result.getByRole('textbox')).toHaveTextContent(
      '{{someFunctionOne}}'
    );
  });
});
