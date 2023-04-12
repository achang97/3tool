import { Box } from '@mui/material';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormFieldLabel } from '../FormFieldLabel';

const mockLabel = 'Label';
const mockTooltip = 'Tooltip';

jest.mock('@mui/material', () => {
  const ActualMui = jest.requireActual('@mui/material');
  return {
    ...ActualMui,
    Box: jest.fn((props) => <ActualMui.Box {...props} />),
  };
});

describe('FormFieldLabel', () => {
  it('renders label', () => {
    render(<FormFieldLabel label={mockLabel} />);
    expect(screen.getByText(mockLabel)).toBeTruthy();
  });

  it('renders tooltip on hover', async () => {
    render(<FormFieldLabel label={mockLabel} tooltip={mockTooltip} />);

    await userEvent.hover(screen.getByTestId('form-field-label-help'));
    expect(await screen.findByText(mockTooltip)).toBeTruthy();
  });

  it('passes sx prop to Box', () => {
    const mockSx = { width: '1000px' };
    render(<FormFieldLabel label={mockLabel} sx={mockSx} />);
    expect(Box).toHaveBeenCalledWith(
      expect.objectContaining({ sx: expect.objectContaining(mockSx) }),
      {}
    );
  });
});
