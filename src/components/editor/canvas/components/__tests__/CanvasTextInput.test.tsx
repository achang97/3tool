import { useComponentEvalData } from '@app/components/editor/hooks/useComponentEvalData';
import { useComponentInputs } from '@app/components/editor/hooks/useComponentInputs';
import { setComponentInput } from '@app/redux/features/activeToolSlice';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CanvasTextInput } from '../CanvasTextInput';

const mockName = 'name';
const mockDispatch = jest.fn();

jest.mock('../../../hooks/useComponentEvalData');
jest.mock('../../../hooks/useComponentInputs');

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

describe('CanvasTextInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useComponentInputs as jest.Mock).mockImplementation(() => ({}));
  });

  describe('props', () => {
    it('defaultValue: sets default value', () => {
      const mockEvalDataValues = { defaultValue: 'default value' };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      const result = render(<CanvasTextInput name={mockName} />);
      expect(result.getByRole('textbox')).toHaveProperty(
        'defaultValue',
        mockEvalDataValues.defaultValue
      );
    });

    it('placeholder: sets placeholder value', () => {
      const mockEvalDataValues = { placeholder: 'placeholder' };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      const result = render(<CanvasTextInput name={mockName} />);
      expect(
        result.getByPlaceholderText(mockEvalDataValues.placeholder)
      ).toBeTruthy();
    });

    it('label: renders label', () => {
      const mockEvalDataValues = { label: 'label' };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      const result = render(<CanvasTextInput name={mockName} />);
      expect(result.getByLabelText(mockEvalDataValues.label)).toBeTruthy();
    });

    it('disabled: sets text input to be disabled', () => {
      const mockEvalDataValues = { disabled: true };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      const result = render(<CanvasTextInput name={mockName} />);
      expect(result.getByRole('textbox')).toBeDisabled();
    });

    it('required: sets text input to be required', () => {
      const mockEvalDataValues = { required: true };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      const result = render(<CanvasTextInput name={mockName} />);
      expect(result.getByRole('textbox')).toBeRequired();
    });
  });

  describe('user input', () => {
    it('value: sets value', () => {
      const mockInputs = { value: 'value' };
      (useComponentInputs as jest.Mock).mockImplementation(() => mockInputs);

      const result = render(<CanvasTextInput name={mockName} />);
      expect(result.getByRole('textbox')).toHaveValue(mockInputs.value);
    });

    it('dispatches action to update component inputs on change', async () => {
      const result = render(<CanvasTextInput name={mockName} />);

      const mockInput = 'n';
      await userEvent.type(result.getByRole('textbox'), mockInput);
      expect(mockDispatch).toHaveBeenCalledWith(
        setComponentInput({
          name: mockName,
          input: { value: mockInput },
        })
      );
    });

    it('minLength: sets minLength prop', () => {
      const mockEvalDataValues = { minLength: 2 };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      const result = render(<CanvasTextInput name={mockName} />);
      expect(result.getByRole('textbox')).toHaveProperty(
        'minLength',
        mockEvalDataValues.minLength
      );
    });

    it('maxLength: sets maxLength prop', () => {
      const mockEvalDataValues = { maxLength: 2 };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      const result = render(<CanvasTextInput name={mockName} />);
      expect(result.getByRole('textbox')).toHaveProperty(
        'maxLength',
        mockEvalDataValues.maxLength
      );
    });
  });

  describe('side effects', () => {
    it('defaultValue: dispatches action to reset value', () => {
      const mockEvalDataValues = { defaultValue: 'hello' };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      render(<CanvasTextInput name={mockName} />);
      expect(mockDispatch).toHaveBeenCalledWith(
        setComponentInput({
          name: mockName,
          input: { value: mockEvalDataValues.defaultValue },
        })
      );
    });
  });

  describe('validation', () => {
    it('renders no error message if user input is undefined', () => {
      const mockEvalDataValues = { required: true };
      const mockInputs = {};

      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));
      (useComponentInputs as jest.Mock).mockImplementation(() => mockInputs);

      const result = render(<CanvasTextInput name={mockName} />);
      expect(result.container.querySelector('.Mui-error')).toBeNull();
    });

    it('renders required error message if user input is empty string', () => {
      const mockEvalDataValues = { required: true };
      const mockInputs = { value: '' };

      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));
      (useComponentInputs as jest.Mock).mockImplementation(() => mockInputs);

      const result = render(<CanvasTextInput name={mockName} />);
      expect(result.getByText('Input is required')).toBeTruthy();
    });

    it('renders min length error message if user input is shorter than min length', () => {
      const mockEvalDataValues = { minLength: 2 };
      const mockInputs = { value: 'a' };

      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));
      (useComponentInputs as jest.Mock).mockImplementation(() => mockInputs);

      const result = render(<CanvasTextInput name={mockName} />);
      expect(
        result.getByText('Input must be at least 2 character(s)')
      ).toBeTruthy();
    });

    it('renders max length error message if user input is longer than max length', () => {
      const mockEvalDataValues = { maxLength: 2 };
      const mockInputs = { value: 'aaa' };

      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));
      (useComponentInputs as jest.Mock).mockImplementation(() => mockInputs);

      const result = render(<CanvasTextInput name={mockName} />);
      expect(
        result.getByText('Input must be at most 2 character(s)')
      ).toBeTruthy();
    });

    it('renders no error message if all conditions are met', () => {
      const mockEvalDataValues = { required: true, minLength: 1, maxLength: 2 };
      const mockInputs = { value: 'a' };

      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));
      (useComponentInputs as jest.Mock).mockImplementation(() => mockInputs);

      const result = render(<CanvasTextInput name={mockName} />);
      expect(result.container.querySelector('.Mui-error')).toBeNull();
    });
  });
});
