import { Alert } from '@mui/material';
import { screen, render } from '@testing-library/react';
import { CodeMirrorPreview } from '../CodeMirrorPreview';

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

describe('CodeMirrorPreview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders alert with type and message', () => {
    render(<CodeMirrorPreview alertType={mockAlertType} type={mockType} message={mockMessage} />);
    expect(screen.getByText(mockType)).toBeTruthy();
    expect(screen.getByText(mockMessage)).toBeTruthy();
  });

  it('passes alertType to Alert component as color', () => {
    render(<CodeMirrorPreview alertType={mockAlertType} type={mockType} message={mockMessage} />);
    expect(Alert).toHaveBeenCalledWith(expect.objectContaining({ color: mockAlertType }), {});
  });
});
