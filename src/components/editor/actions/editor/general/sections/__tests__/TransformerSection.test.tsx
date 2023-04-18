import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import { TransformerSection } from '../TransformerSection';

const mockHandleDataChange = jest.fn();

jest.mock('@app/components/editor/hooks/useCodeMirrorJavascriptAutocomplete', () => ({
  useCodeMirrorJavascriptAutocomplete: jest.fn(() => () => ({
    from: 0,
    options: [],
  })),
}));

describe('TransformerSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders section label', () => {
    render(<TransformerSection onDataChange={mockHandleDataChange} />);
    expect(screen.getByText('Transformer')).toBeTruthy();
  });

  it('renders placeholder', () => {
    render(<TransformerSection onDataChange={mockHandleDataChange} />);
    expect(
      screen.getByText('return formatDataAsArray(data).filter(row => row.quantity > 20)')
    ).toBeTruthy();
  });

  it('renders transformer value', () => {
    const mockTransformer = 'value';
    render(
      <TransformerSection
        data={{ transformer: mockTransformer, transformerEnabled: true }}
        onDataChange={mockHandleDataChange}
      />
    );
    expect(screen.getByText(mockTransformer)).toBeTruthy();
  });

  it('hides textbox if transformerEnabled is false', async () => {
    render(
      <TransformerSection
        data={{ transformer: '', transformerEnabled: false }}
        onDataChange={mockHandleDataChange}
      />
    );
    expect(screen.getByTestId('transformer-section-code')).not.toBeVisible();
  });

  it('calls onDataChange on transformer value change', async () => {
    const mockValue = 'value';
    render(
      <TransformerSection
        data={{ transformer: '', transformerEnabled: true }}
        onDataChange={mockHandleDataChange}
      />
    );
    const input = screen.getByRole('textbox');
    await userEvent.type(input, mockValue);
    expect(mockHandleDataChange).toHaveBeenCalledWith({
      transformer: mockValue,
    });
  });

  it('calls onDataChange on section enabled toggle', async () => {
    render(
      <TransformerSection
        data={{ transformer: '', transformerEnabled: true }}
        onDataChange={mockHandleDataChange}
      />
    );
    await userEvent.click(screen.getByRole('checkbox'));
    expect(mockHandleDataChange).toHaveBeenCalledWith({
      transformerEnabled: false,
    });
  });
});
