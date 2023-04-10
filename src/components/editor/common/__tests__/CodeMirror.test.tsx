import { snippetCompletion } from '@codemirror/autocomplete';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { replaceSpecialChars } from '@tests/utils/userEvent';
import { useCodeMirrorJavascriptAutocomplete } from '../../hooks/useCodeMirrorJavascriptAutocomplete';
import { useCodeMirrorPreview } from '../../hooks/useCodeMirrorPreview';
import { CodeMirror } from '../CodeMirror';

const mockHandleChange = jest.fn();

const mockType = 'string';
const mockPreview = {
  alertType: 'success',
  type: 'number',
  message: '4',
};

jest.mock('../../hooks/useCodeMirrorPreview', () => ({
  useCodeMirrorPreview: jest.fn(() => mockPreview),
}));

jest.mock('../../hooks/useCodeMirrorJavascriptAutocomplete', () => ({
  useCodeMirrorJavascriptAutocomplete: jest.fn(() => ({
    from: 0,
    options: [],
  })),
}));

describe('CodeMirror', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('general', () => {
    it('renders label', () => {
      const mockLabel = 'Label';
      const result = render(
        <CodeMirror label={mockLabel} type={mockType} onChange={mockHandleChange} language="text" />
      );
      expect(result.getByText(mockLabel)).toBeTruthy();
    });

    it('renders placeholder', () => {
      const mockPlaceholder = 'Placeholder';
      const result = render(
        <CodeMirror
          type={mockType}
          placeholder={mockPlaceholder}
          onChange={mockHandleChange}
          language="text"
        />
      );
      expect(result.getByText(mockPlaceholder)).toBeTruthy();
    });

    it('calls onChange on input change', async () => {
      const result = render(
        <CodeMirror type={mockType} onChange={mockHandleChange} language="text" />
      );

      const newValue = 'h';

      const input = result.getByRole('textbox');
      await userEvent.type(input, newValue);

      expect(mockHandleChange).toHaveBeenCalledWith(newValue, expect.any(Object));
    });

    it('sets initial input value to value prop', () => {
      const mockValue = 'hello';

      const result = render(
        <CodeMirror value={mockValue} type={mockType} onChange={mockHandleChange} language="text" />
      );

      expect(result.getByText(mockValue)).toBeTruthy();
    });

    it('does not update input value to match value prop if isAutosaved is true', () => {
      const mockValue = 'hello';
      const mockNewValue = 'hello world!';

      const result = render(
        <CodeMirror
          value={mockValue}
          type={mockType}
          onChange={mockHandleChange}
          language="text"
          isAutosaved
        />
      );

      expect(result.getByText(mockValue)).toBeTruthy();

      result.rerender(
        <CodeMirror
          value={mockNewValue}
          type={mockType}
          onChange={mockHandleChange}
          language="text"
          isAutosaved
        />
      );

      expect(result.getByText(mockValue)).toBeTruthy();
      expect(result.queryByText(mockNewValue)).toBeNull();
    });

    it('updates input value to match value prop if isAutosaved is false', () => {
      const mockValue = 'hello';
      const mockNewValue = 'hello world!';

      const result = render(
        <CodeMirror value={mockValue} type={mockType} onChange={mockHandleChange} language="text" />
      );

      expect(result.getByText(mockValue)).toBeTruthy();

      result.rerender(
        <CodeMirror
          value={mockNewValue}
          type={mockType}
          onChange={mockHandleChange}
          language="text"
        />
      );

      expect(result.getByText(mockNewValue)).toBeTruthy();
    });
  });

  describe('preview', () => {
    const previewId = 'code-mirror-preview';

    it('renders dynamic preview when input is focused', async () => {
      const result = render(
        <CodeMirror type={mockType} onChange={mockHandleChange} language="text" />
      );

      await userEvent.click(result.getByRole('textbox'));

      expect(result.getByText(mockPreview.type)).toBeTruthy();
      expect(result.getByText(mockPreview.message)).toBeTruthy();
    });

    it('does not render dynamic preview when input is not focused', () => {
      const result = render(
        <CodeMirror type={mockType} onChange={mockHandleChange} language="text" />
      );
      expect(result.queryByTestId(previewId)).toBeNull();
    });

    it('does not render dynamic preview if language is javascript', async () => {
      const result = render(<CodeMirror onChange={mockHandleChange} language="javascript" />);

      await userEvent.click(result.getByRole('textbox'));
      expect(result.queryByTestId(previewId)).toBeNull();
    });

    it('does not render dynamic preview if preview data is null', async () => {
      (useCodeMirrorPreview as jest.Mock).mockImplementation(() => null);
      const result = render(<CodeMirror onChange={mockHandleChange} language="javascript" />);

      await userEvent.click(result.getByRole('textbox'));
      expect(result.queryByTestId(previewId)).toBeNull();
    });
  });

  describe('autocomplete', () => {
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
      (useCodeMirrorJavascriptAutocomplete as jest.Mock).mockImplementation(() => {
        return () => ({
          from: 2,
          options: mockAutocompleteOptions,
        });
      });

      const result = render(
        <CodeMirror type={mockType} onChange={mockHandleChange} language="text" />
      );

      const input = result.getByRole('textbox');
      await userEvent.type(input, replaceSpecialChars('{{someFunction'));

      const options = await result.findAllByRole('option');
      expect(options).toHaveLength(2);
      expect(options[0]).toHaveTextContent('someFunctionOne');
      expect(options[1]).toHaveTextContent('someFunctionTwo');

      await userEvent.click(options[0]);
      expect(result.getByRole('textbox')).toHaveTextContent('{{someFunctionOne}}');
    });
  });
});
