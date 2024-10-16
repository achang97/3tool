import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import { useLocalEvalArgs } from '@app/components/editor/hooks/useLocalEvalArgs';
import { LoopSection } from '../LoopSection';

const mockHandleDataChange = jest.fn();

jest.mock('@app/components/editor/hooks/useCodeMirrorJavascriptAutocomplete', () => ({
  useCodeMirrorJavascriptAutocomplete: jest.fn(() => () => ({
    from: 0,
    options: [],
  })),
}));

jest.mock('@app/components/editor/hooks/useLocalEvalArgs');

describe('LoopSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLocalEvalArgs as jest.Mock).mockImplementation(() => ({}));
  });

  it('renders section label', () => {
    render(<LoopSection onDataChange={mockHandleDataChange} />);
    expect(screen.getByText('Loop')).toBeTruthy();
  });

  it('renders placeholder', () => {
    render(<LoopSection onDataChange={mockHandleDataChange} />);
    expect(screen.getByText('return []')).toBeTruthy();
  });

  it('renders helper text', () => {
    render(<LoopSection onDataChange={mockHandleDataChange} />);
    expect(screen.getByTestId('loop-section-helper-text')).toHaveTextContent(
      'Use the code block above to return an array of data objects. Then, use {{ element }} anywhere in this action to reference the current value that is being looped over.'
    );
  });

  it('renders error', () => {
    const mockError = 'error';
    (useLocalEvalArgs as jest.Mock).mockImplementation(() => ({ error: mockError }));
    render(<LoopSection onDataChange={mockHandleDataChange} />);
    expect(screen.getByText(mockError)).toBeTruthy();
  });

  it('renders loop elements value', () => {
    const mockLoopElements = 'asdf';
    render(
      <LoopSection
        data={{ loopElements: mockLoopElements, loopEnabled: true }}
        onDataChange={mockHandleDataChange}
      />
    );
    expect(screen.getByText(mockLoopElements)).toBeTruthy();
  });

  it('hides textbox if loopEnabled is false', async () => {
    render(
      <LoopSection
        data={{ loopElements: '', loopEnabled: false }}
        onDataChange={mockHandleDataChange}
      />
    );
    expect(screen.getByTestId('loop-section-code')).not.toBeVisible();
  });

  it('calls onDataChange on loop value change', async () => {
    const mockValue = 'value';
    render(
      <LoopSection
        data={{ loopElements: '', loopEnabled: true }}
        onDataChange={mockHandleDataChange}
      />
    );
    const input = screen.getByRole('textbox');
    await userEvent.type(input, mockValue);
    expect(mockHandleDataChange).toHaveBeenCalledWith({
      loopElements: mockValue,
    });
  });

  it('calls onDataChange on section enabled toggle', async () => {
    render(
      <LoopSection
        data={{ loopElements: '', loopEnabled: true }}
        onDataChange={mockHandleDataChange}
      />
    );
    await userEvent.click(screen.getByRole('checkbox'));
    expect(mockHandleDataChange).toHaveBeenCalledWith({
      loopEnabled: false,
    });
  });
});
