import { Alert } from '@mui/material';
import { render } from '@testing-library/react';
import { DynamicTextFieldPreview } from '../DynamicTextFieldPreview';

const mockAlertType = 'success';
const mockType = 'number';
const mockMessage = 'Some message';

jest.mock('@mui/material', () => {
  const ActualMui = jest.requireActual('@mui/material');
  return {
    ...ActualMui,
    Alert: jest.fn((props) => <ActualMui.Alert {...props} />),
  };
});

describe('DynamicTextFieldPreview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders alert with type and message', () => {
    const result = render(
      <DynamicTextFieldPreview
        alertType={mockAlertType}
        type={mockType}
        message={mockMessage}
      />
    );
    expect(result.getByText(mockType)).toBeTruthy();
    expect(result.getByText(mockMessage)).toBeTruthy();
  });

  it('passes alertType to Alert component as color', () => {
    render(
      <DynamicTextFieldPreview
        alertType={mockAlertType}
        type={mockType}
        message={mockMessage}
      />
    );
    expect(Alert).toHaveBeenCalledWith(
      expect.objectContaining({ color: mockAlertType }),
      {}
    );
  });
});
