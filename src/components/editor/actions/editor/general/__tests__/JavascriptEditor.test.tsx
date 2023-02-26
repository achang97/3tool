import { Action, ActionType } from '@app/types';
import { within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@tests/utils/renderWithContext';
import { JavascriptEditor } from '../JavascriptEditor';

const mockType = ActionType.Javascript;
const mockData: Action['data'] = {
  javascript: {
    code: 'code',
    transformer: 'transformer',
  },
};

const mockHandleUpdateData = jest.fn();

jest.mock(
  '@app/components/editor/hooks/useCodeMirrorJavascriptAutocomplete',
  () => ({
    useCodeMirrorJavascriptAutocomplete: jest.fn(() => () => ({
      from: 0,
      options: [],
    })),
  })
);

describe('JavascriptEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('code', () => {
    it('renders label', () => {
      const result = render(
        <JavascriptEditor
          type={mockType}
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );
      expect(result.getByText('JS Code (JavaScript)')).toBeTruthy();
    });

    it('displays value from code field', () => {
      const result = render(
        <JavascriptEditor
          type={mockType}
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );
      expect(
        result.getByText(mockData.javascript?.code as string)
      ).toBeTruthy();
    });

    it('calls onUpdateData with code field', async () => {
      const mockValue = '1';
      const result = render(
        <JavascriptEditor
          type={mockType}
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );
      const input = within(
        result.getByTestId('code-mirror-JS Code (JavaScript)')
      ).getByRole('textbox');
      await userEvent.type(input, mockValue);
      expect(mockHandleUpdateData).toHaveBeenCalledWith({
        code: `${mockValue}${mockData.javascript?.code}`,
      });
    });
  });

  describe('transformer', () => {
    it('displays value from transformer field', () => {
      const result = render(
        <JavascriptEditor
          type={mockType}
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );
      expect(
        result.getByText(mockData.javascript?.transformer as string)
      ).toBeTruthy();
    });

    it('calls onUpdateData with transformer field', async () => {
      const mockValue = '1';
      const result = render(
        <JavascriptEditor
          type={mockType}
          data={mockData}
          onUpdateData={mockHandleUpdateData}
        />
      );
      const input = within(
        result.getByTestId('code-mirror-Transformer (JavaScript)')
      ).getByRole('textbox');
      await userEvent.type(input, mockValue);
      expect(mockHandleUpdateData).toHaveBeenCalledWith({
        transformer: `${mockValue}${mockData.javascript?.transformer}`,
      });
    });
  });
});
