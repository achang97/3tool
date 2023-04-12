import { Action } from '@app/types';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@tests/utils/renderWithContext';
import { JavascriptEditor } from '../JavascriptEditor';

const mockData: Action['data']['javascript'] = {
  code: 'code',
  transformer: 'transformer',
};

const mockHandleDataChange = jest.fn();

jest.mock('@app/components/editor/hooks/useCodeMirrorJavascriptAutocomplete', () => ({
  useCodeMirrorJavascriptAutocomplete: jest.fn(() => () => ({
    from: 0,
    options: [],
  })),
}));

describe('JavascriptEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('code', () => {
    it('renders label', () => {
      render(<JavascriptEditor data={mockData} onDataChange={mockHandleDataChange} />);
      expect(screen.getByText('JS Code (JavaScript)')).toBeTruthy();
    });

    it('displays value from code field', () => {
      render(<JavascriptEditor data={mockData} onDataChange={mockHandleDataChange} />);
      expect(screen.getByText(mockData?.code as string)).toBeTruthy();
    });

    it('calls onDataChange with code field', async () => {
      const mockValue = '1';
      render(<JavascriptEditor data={mockData} onDataChange={mockHandleDataChange} />);
      const input = within(screen.getByTestId('code-mirror-JS Code (JavaScript)')).getByRole(
        'textbox'
      );
      await userEvent.type(input, mockValue);
      expect(mockHandleDataChange).toHaveBeenCalledWith({
        code: `${mockValue}${mockData?.code}`,
      });
    });
  });

  describe('transformer', () => {
    it('displays value from transformer field', () => {
      render(<JavascriptEditor data={mockData} onDataChange={mockHandleDataChange} />);
      expect(screen.getByText(mockData?.transformer as string)).toBeTruthy();
    });

    it('calls onDataChange with transformer field', async () => {
      const mockValue = '1';
      render(<JavascriptEditor data={mockData} onDataChange={mockHandleDataChange} />);
      const input = within(screen.getByTestId('code-mirror-Transformer (JavaScript)')).getByRole(
        'textbox'
      );
      await userEvent.type(input, mockValue);
      expect(mockHandleDataChange).toHaveBeenCalledWith({
        transformer: `${mockValue}${mockData?.transformer}`,
      });
    });
  });
});
