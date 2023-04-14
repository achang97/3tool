import { Action, ActionType } from '@app/types';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@tests/utils/renderWithContext';
import { JavascriptEditor } from '../JavascriptEditor';

const mockType = ActionType.Javascript;
const mockData: Action['data']['javascript'] = {
  code: 'code',
  transformer: 'transformer',
  transformerEnabled: true,
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
    it('renders section label', () => {
      render(
        <JavascriptEditor type={mockType} data={mockData} onDataChange={mockHandleDataChange} />
      );
      expect(screen.getByText('JS Code')).toBeTruthy();
    });

    it('displays value from code field', () => {
      render(
        <JavascriptEditor type={mockType} data={mockData} onDataChange={mockHandleDataChange} />
      );
      expect(screen.getByText(mockData?.code as string)).toBeTruthy();
    });

    it('calls onDataChange with code field', async () => {
      const mockValue = '1';
      render(
        <JavascriptEditor type={mockType} data={mockData} onDataChange={mockHandleDataChange} />
      );
      const input = within(screen.getByTestId('javascript-editor-js-code')).getByRole('textbox');
      await userEvent.type(input, mockValue);
      expect(mockHandleDataChange).toHaveBeenCalledWith({
        code: `${mockValue}${mockData?.code}`,
      });
    });
  });

  it('renders transformer section', () => {
    render(
      <JavascriptEditor type={mockType} data={mockData} onDataChange={mockHandleDataChange} />
    );
    expect(screen.getByTestId('transformer-section')).toBeTruthy();
  });
});
