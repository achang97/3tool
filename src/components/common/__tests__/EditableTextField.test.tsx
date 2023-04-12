import { TextField, TextFieldProps, Typography, TypographyProps } from '@mui/material';
import { screen, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditableTextField } from '../EditableTextField';

const mockHandleSubmit = jest.fn();
const mockValue = 'Some Value';

jest.mock('@mui/material', () => {
  const ActualMui = jest.requireActual('@mui/material');
  return {
    ...ActualMui,
    Typography: jest.fn((props) => <ActualMui.Typography {...props} />),
    TextField: jest.fn((props) => <ActualMui.TextField {...props} />),
  };
});

describe('EditableTextField', () => {
  const textId = 'editable-text-field-view';
  const inputId = 'editable-text-field-edit';
  const editIconId = 'editable-text-field-edit-icon';
  const disabledIconId = 'editable-text-field-disabled-icon';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('toggle', () => {
    it('renders value as text', () => {
      render(<EditableTextField value={mockValue} />);
      expect(screen.getByTestId(textId)).toHaveTextContent(mockValue);
    });

    it('toggles to text field if editable', async () => {
      render(<EditableTextField value={mockValue} />);

      await userEvent.click(screen.getByTestId(textId));
      expect(within(await screen.findByTestId(inputId)).getByRole('textbox')).toHaveValue(
        mockValue
      );
    });

    it('does not toggle to text field if not editable', async () => {
      const result = render(<EditableTextField value={mockValue} isEditable={false} />);

      await userEvent.click(screen.getByTestId(textId));
      expect(screen.queryByTestId(inputId)).toBeNull();

      // Check that field remains in view mode even when isEditable is flipped to true
      result.rerender(<EditableTextField value={mockValue} isEditable />);
      expect(screen.queryByTestId(inputId)).toBeNull();
    });
  });

  describe('edit icon', () => {
    it('shows edit icon if editable and hovering', async () => {
      render(<EditableTextField value={mockValue} showIcon />);
      await userEvent.hover(screen.getByTestId(textId));
      expect(screen.getByTestId(editIconId)).toBeVisible();
    });

    it('shows disabled icon if not editable and hovering', async () => {
      render(<EditableTextField value={mockValue} isEditable={false} showIcon />);
      await userEvent.hover(screen.getByTestId(textId));
      expect(screen.getByTestId(disabledIconId)).toBeVisible();
    });

    it('does not show edit icon if not hovering', async () => {
      render(<EditableTextField value={mockValue} showIcon />);
      expect(screen.getByTestId(editIconId)).not.toBeVisible();
    });

    it('does not show edit icon if showIcon is false', async () => {
      render(<EditableTextField value={mockValue} />);
      await userEvent.hover(screen.getByTestId(textId));
      expect(screen.getByTestId(editIconId)).not.toBeVisible();
    });

    it('shows tooltip if hovering over edit icon', async () => {
      const mockTooltip = 'This is a test tooltip';
      render(<EditableTextField value={mockValue} iconTooltip={mockTooltip} showIcon />);
      await userEvent.hover(screen.getByTestId(editIconId));
      expect(await screen.findByText(mockTooltip)).toBeVisible();
    });
  });

  describe('onSubmit', () => {
    it('calls onSubmit on input blur', async () => {
      render(
        <>
          <EditableTextField value={mockValue} onSubmit={mockHandleSubmit} />
          <div>Blur</div>
        </>
      );

      await userEvent.click(screen.getByTestId(textId));
      await screen.findByTestId(inputId);

      const newValueText = '1234';
      await userEvent.keyboard(newValueText);

      await userEvent.click(screen.getByText('Blur'));
      expect(mockHandleSubmit).toHaveBeenCalledWith(`${mockValue}${newValueText}`);
    });

    it('calls onSubmit on enter keypress', async () => {
      render(<EditableTextField value={mockValue} onSubmit={mockHandleSubmit} />);

      await userEvent.click(screen.getByTestId(textId));
      await screen.findByTestId(inputId);

      const newValueText = '1234';
      await userEvent.keyboard(newValueText);
      await userEvent.keyboard('[Enter]');

      expect(mockHandleSubmit).toHaveBeenCalledWith(`${mockValue}${newValueText}`);
    });

    it('does not call onSubmit if value has not changed', async () => {
      render(<EditableTextField value={mockValue} onSubmit={mockHandleSubmit} />);

      await userEvent.click(screen.getByTestId(textId));
      await screen.findByTestId(inputId);
      await userEvent.keyboard('[Enter]');

      expect(mockHandleSubmit).not.toHaveBeenCalled();
    });

    it('resets local value to initial value on submit', async () => {
      render(<EditableTextField value={mockValue} onSubmit={mockHandleSubmit} />);

      await userEvent.click(screen.getByTestId(textId));
      await screen.findByTestId(inputId);

      const newValueText = '1234';
      await userEvent.keyboard(newValueText);
      await userEvent.keyboard('[Enter]');

      expect(mockHandleSubmit).toHaveBeenCalledWith(`${mockValue}${newValueText}`);

      await userEvent.click(screen.getByTestId(textId));
      expect(within(await screen.findByTestId(inputId)).getByRole('textbox')).toHaveValue(
        mockValue
      );
    });

    it('resets local value to new value', async () => {
      const result = render(<EditableTextField value={mockValue} onSubmit={mockHandleSubmit} />);

      await userEvent.click(screen.getByTestId(textId));
      expect(within(await screen.findByTestId(inputId)).getByRole('textbox')).toHaveValue(
        mockValue
      );
      await userEvent.keyboard('[Enter]');

      const newValue = 'New Value';
      result.rerender(<EditableTextField value={newValue} onSubmit={mockHandleSubmit} />);
      await userEvent.click(screen.getByTestId(textId));
      expect(within(await screen.findByTestId(inputId)).getByRole('textbox')).toHaveValue(newValue);
    });
  });

  describe('style', () => {
    it('passes height to Typography', () => {
      render(<EditableTextField value={mockValue} onSubmit={mockHandleSubmit} height={10} />);

      expect(screen.getByTestId(textId)).toHaveStyle({ height: '10px' });
    });

    it('passes height to TextField', async () => {
      render(<EditableTextField value={mockValue} onSubmit={mockHandleSubmit} height={10} />);

      await userEvent.click(screen.getByTestId(textId));
      expect(screen.getByTestId(inputId)).toHaveStyle({
        height: '10px',
      });
    });

    it('passes TypographyProps to Typography', () => {
      const mockTypographyProps: TypographyProps = {
        textAlign: 'center',
        sx: { width: '1000px' },
      };

      render(
        <EditableTextField
          value={mockValue}
          onSubmit={mockHandleSubmit}
          TypographyProps={mockTypographyProps}
        />
      );

      expect((Typography as jest.Mock).mock.calls[0][0]).toMatchObject(mockTypographyProps);
    });

    it('passes TextFieldProps to TextField', async () => {
      const mockTextFieldProps: TextFieldProps = {
        label: 'Something',
        sx: { width: '1000px' },
      };

      render(
        <EditableTextField
          value={mockValue}
          onSubmit={mockHandleSubmit}
          TextFieldProps={mockTextFieldProps}
        />
      );

      await userEvent.click(screen.getByTestId(textId));
      expect(TextField).toHaveBeenCalledWith(expect.objectContaining(mockTextFieldProps), {});
    });
  });
});
