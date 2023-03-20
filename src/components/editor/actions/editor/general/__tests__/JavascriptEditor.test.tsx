import { Action } from '@app/types';
import { within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@tests/utils/renderWithContext';
import { JavascriptEditor } from '../JavascriptEditor';

const mockData: Action['data']['javascript'] = {
  code: 'code',
  transformer: 'transformer',
};

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

describe('JavascriptEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('code', () => {
    it('renders label', () => {
      const result = render(
        <JavascriptEditor data={mockData} onChangeData={mockHandleChangeData} />
      );
      expect(result.getByText('JS Code (JavaScript)')).toBeTruthy();
    });

    it('displays value from code field', () => {
      const result = render(
        <JavascriptEditor data={mockData} onChangeData={mockHandleChangeData} />
      );
      expect(result.getByText(mockData?.code as string)).toBeTruthy();
    });

    it('calls onChangeData with code field', async () => {
      const mockValue = '1';
      const result = render(
        <JavascriptEditor data={mockData} onChangeData={mockHandleChangeData} />
      );
      const input = within(
        result.getByTestId('code-mirror-JS Code (JavaScript)')
      ).getByRole('textbox');
      await userEvent.type(input, mockValue);
      expect(mockHandleChangeData).toHaveBeenCalledWith({
        code: `${mockValue}${mockData?.code}`,
      });
    });
  });

  describe('transformer', () => {
    it('displays value from transformer field', () => {
      const result = render(
        <JavascriptEditor data={mockData} onChangeData={mockHandleChangeData} />
      );
      expect(result.getByText(mockData?.transformer as string)).toBeTruthy();
    });

    it('calls onChangeData with transformer field', async () => {
      const mockValue = '1';
      const result = render(
        <JavascriptEditor data={mockData} onChangeData={mockHandleChangeData} />
      );
      const input = within(
        result.getByTestId('code-mirror-Transformer (JavaScript)')
      ).getByRole('textbox');
      await userEvent.type(input, mockValue);
      expect(mockHandleChangeData).toHaveBeenCalledWith({
        transformer: `${mockValue}${mockData?.transformer}`,
      });
    });
  });
});
