import { useComponentEvalData } from '@app/components/editor/hooks/useComponentEvalData';
import { useComponentInputs } from '@app/components/editor/hooks/useComponentInputs';
import { setComponentInput } from '@app/redux/features/activeToolSlice';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CanvasTextInput } from '../CanvasTextInput';

const mockName = 'name';
const mockDispatch = jest.fn();
const mockEventHandlerCallbacks = {
  onClick: jest.fn(),
};

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
    it('defaultValue: sets value if value is not defined', () => {
      const mockEvalDataValues = { defaultValue: 'default value' };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      render(<CanvasTextInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />);
      expect(screen.getByRole('textbox')).toHaveValue(mockEvalDataValues.defaultValue);
    });

    it('placeholder: sets placeholder value', () => {
      const mockEvalDataValues = { placeholder: 'placeholder' };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      render(<CanvasTextInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />);
      expect(screen.getByPlaceholderText(mockEvalDataValues.placeholder)).toBeTruthy();
    });

    it('label: renders label', () => {
      const mockEvalDataValues = { label: 'label' };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      render(<CanvasTextInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />);
      expect(screen.getByLabelText(mockEvalDataValues.label)).toBeTruthy();
    });

    it('disabled: sets text input to be disabled', () => {
      const mockEvalDataValues = { disabled: true };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      render(<CanvasTextInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('required: sets text input to be required', () => {
      const mockEvalDataValues = { required: true };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      render(<CanvasTextInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />);
      expect(screen.getByRole('textbox')).toBeRequired();
    });
  });

  describe('user input', () => {
    it('value: sets value', () => {
      const mockInputs = { value: 'value' };
      (useComponentInputs as jest.Mock).mockImplementation(() => mockInputs);

      render(<CanvasTextInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />);
      expect(screen.getByRole('textbox')).toHaveValue(mockInputs.value);
    });

    it('dispatches action to update component inputs on change', async () => {
      render(<CanvasTextInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />);

      const mockInput = 'n';
      await userEvent.type(screen.getByRole('textbox'), mockInput);
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

      render(<CanvasTextInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />);
      expect(screen.getByRole('textbox')).toHaveProperty('minLength', mockEvalDataValues.minLength);
    });

    it('maxLength: sets maxLength prop', () => {
      const mockEvalDataValues = { maxLength: 2 };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      render(<CanvasTextInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />);
      expect(screen.getByRole('textbox')).toHaveProperty('maxLength', mockEvalDataValues.maxLength);
    });
  });

  describe('side effects', () => {
    describe('defaultValue', () => {
      it('resets value to default value', () => {
        const mockEvalDataValues = { defaultValue: 'hello' };
        (useComponentEvalData as jest.Mock).mockImplementation(() => ({
          evalDataValues: mockEvalDataValues,
        }));

        render(
          <CanvasTextInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />
        );
        expect(mockDispatch).toHaveBeenCalledWith(
          setComponentInput({
            name: mockName,
            input: { value: mockEvalDataValues.defaultValue },
          })
        );
      });

      it('resets value to undefined if default value is empty string', () => {
        const mockEvalDataValues = { defaultValue: '' };
        (useComponentEvalData as jest.Mock).mockImplementation(() => ({
          evalDataValues: mockEvalDataValues,
        }));

        render(
          <CanvasTextInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />
        );
        expect(mockDispatch).toHaveBeenCalledWith(
          setComponentInput({
            name: mockName,
            input: { value: undefined },
          })
        );
      });
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

      const result = render(
        <CanvasTextInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />
      );
      expect(result.container.querySelector('.Mui-error')).toBeNull();
    });

    it('renders required error message if user input is empty string', () => {
      const mockEvalDataValues = { required: true };
      const mockInputs = { value: '' };

      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));
      (useComponentInputs as jest.Mock).mockImplementation(() => mockInputs);

      render(<CanvasTextInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />);
      expect(screen.getByText('Input is required')).toBeTruthy();
    });

    it.each`
      minLength | term
      ${1}      | ${'character'}
      ${2}      | ${'characters'}
    `(
      'renders min length $minLength error message if user input is shorter than min length',
      ({ minLength, term }: { minLength: number; term: string }) => {
        const mockEvalDataValues = { minLength };
        const mockInputs = { value: '' };

        (useComponentEvalData as jest.Mock).mockImplementation(() => ({
          evalDataValues: mockEvalDataValues,
        }));
        (useComponentInputs as jest.Mock).mockImplementation(() => mockInputs);

        render(
          <CanvasTextInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />
        );
        expect(screen.getByText(`Input must be at least ${minLength} ${term}`)).toBeTruthy();
      }
    );

    it.each`
      maxLength | term
      ${1}      | ${'character'}
      ${2}      | ${'characters'}
    `(
      'renders max length $maxLength error message if user input is longer than max length',
      ({ maxLength, term }: { maxLength: number; term: string }) => {
        const mockEvalDataValues = { maxLength };
        const mockInputs = { value: 'aaa' };

        (useComponentEvalData as jest.Mock).mockImplementation(() => ({
          evalDataValues: mockEvalDataValues,
        }));
        (useComponentInputs as jest.Mock).mockImplementation(() => mockInputs);

        render(
          <CanvasTextInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />
        );
        expect(screen.getByText(`Input must be at most ${maxLength} ${term}`)).toBeTruthy();
      }
    );

    it('renders no error message if all conditions are met', () => {
      const mockEvalDataValues = { required: true, minLength: 1, maxLength: 2 };
      const mockInputs = { value: 'a' };

      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));
      (useComponentInputs as jest.Mock).mockImplementation(() => mockInputs);

      const result = render(
        <CanvasTextInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />
      );
      expect(result.container.querySelector('.Mui-error')).toBeNull();
    });
  });

  describe('event handlers', () => {
    it('passes event handlers to input', async () => {
      render(<CanvasTextInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />);
      await userEvent.click(screen.getByRole('textbox'));
      expect(mockEventHandlerCallbacks.onClick).toHaveBeenCalled();
    });
  });
});
