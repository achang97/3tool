import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import { LoopSection } from '../LoopSection';

const mockHandleDataChange = jest.fn();

jest.mock('@app/components/editor/hooks/useCodeMirrorJavascriptAutocomplete', () => ({
  useCodeMirrorJavascriptAutocomplete: jest.fn(() => () => ({
    from: 0,
    options: [],
  })),
}));

describe('LoopSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders section label', () => {
    render(<LoopSection onDataChange={mockHandleDataChange} />);
    expect(screen.getByText('Loop')).toBeTruthy();
  });

  it('renders placeholder', () => {
    render(<LoopSection onDataChange={mockHandleDataChange} />);
    expect(screen.getByText('return []')).toBeTruthy();
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
    expect(screen.getByTestId('loop-code')).not.toBeVisible();
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
