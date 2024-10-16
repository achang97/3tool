import { useComponentEvalData } from '@app/components/editor/hooks/useComponentEvalData';
import { useComponentInputs } from '@app/components/editor/hooks/useComponentInputs';
import { setComponentInput } from '@app/redux/features/activeToolSlice';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CanvasNumberInput } from '../CanvasNumberInput';

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

describe('CanvasNumberInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useComponentInputs as jest.Mock).mockImplementation(() => ({}));
  });

  describe('props', () => {
    it('defaultValue: sets default value if value is not defined', () => {
      const mockEvalDataValues = { defaultValue: 2 };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      render(
        <CanvasNumberInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />
      );
      expect(screen.getByRole('spinbutton')).toHaveValue(mockEvalDataValues.defaultValue);
    });

    it('placeholder: sets placeholder value', () => {
      const mockEvalDataValues = { placeholder: 'placeholder' };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      render(
        <CanvasNumberInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />
      );
      expect(screen.getByPlaceholderText(mockEvalDataValues.placeholder)).toBeTruthy();
    });

    it('label: renders label', () => {
      const mockEvalDataValues = { label: 'label' };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      render(
        <CanvasNumberInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />
      );
      expect(screen.getByLabelText(mockEvalDataValues.label)).toBeTruthy();
    });

    it('disabled: sets number input to be disabled', () => {
      const mockEvalDataValues = { disabled: true };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      render(
        <CanvasNumberInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />
      );
      expect(screen.getByRole('spinbutton')).toBeDisabled();
    });

    it('required: sets number input to be required', () => {
      const mockEvalDataValues = { required: true };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      render(
        <CanvasNumberInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />
      );
      expect(screen.getByRole('spinbutton')).toBeRequired();
    });

    it('minimum: sets min prop', () => {
      const mockEvalDataValues = { minimum: 2 };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      render(
        <CanvasNumberInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />
      );
      expect(screen.getByRole('spinbutton')).toHaveProperty(
        'min',
        mockEvalDataValues.minimum.toString()
      );
    });

    it('maximum: sets max prop', () => {
      const mockEvalDataValues = { maximum: 2 };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      render(
        <CanvasNumberInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />
      );
      expect(screen.getByRole('spinbutton')).toHaveProperty(
        'max',
        mockEvalDataValues.maximum.toString()
      );
    });
  });

  describe('user input', () => {
    describe('value', () => {
      it('sets integer value', () => {
        const mockInputs = { value: 24 };
        (useComponentInputs as jest.Mock).mockImplementation(() => mockInputs);

        render(
          <CanvasNumberInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />
        );
        expect(screen.getByRole('spinbutton')).toHaveValue(mockInputs.value);
      });

      it('sets float value', () => {
        const mockInputs = { value: 24.3 };
        (useComponentInputs as jest.Mock).mockImplementation(() => mockInputs);

        render(
          <CanvasNumberInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />
        );
        expect(screen.getByRole('spinbutton')).toHaveValue(mockInputs.value);
      });
    });

    it('dispatches action to update component inputs on change', async () => {
      render(
        <CanvasNumberInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />
      );

      const mockInput = '1';
      await userEvent.type(screen.getByRole('spinbutton'), mockInput);
      expect(mockDispatch).toHaveBeenCalledWith(
        setComponentInput({
          name: mockName,
          input: { value: 1 },
        })
      );
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
          <CanvasNumberInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />
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
          <CanvasNumberInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />
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
        <CanvasNumberInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />
      );
      expect(result.container.querySelector('.Mui-error')).toBeNull();
    });

    it('renders required error message if user input is NaN', () => {
      const mockEvalDataValues = { required: true };
      const mockInputs = { value: NaN };

      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));
      (useComponentInputs as jest.Mock).mockImplementation(() => mockInputs);

      render(
        <CanvasNumberInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />
      );
      expect(screen.getByText('Input is required')).toBeTruthy();
    });

    it('renders min length error message if user input is smaller than minimum', () => {
      const mockEvalDataValues = { minimum: 2 };
      const mockInputs = { value: 1 };

      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));
      (useComponentInputs as jest.Mock).mockImplementation(() => mockInputs);

      render(
        <CanvasNumberInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />
      );
      expect(screen.getByText('Input must be at least 2')).toBeTruthy();
    });

    it('renders max length error message if user input is bigger than maximum', () => {
      const mockEvalDataValues = { maximum: 2 };
      const mockInputs = { value: 3 };

      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));
      (useComponentInputs as jest.Mock).mockImplementation(() => mockInputs);

      render(
        <CanvasNumberInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />
      );
      expect(screen.getByText('Input must be at most 2')).toBeTruthy();
    });

    it('renders no error message if all conditions are met', () => {
      const mockEvalDataValues = { required: true, minimum: 1, maximum: 2 };
      const mockInputs = { value: 1 };

      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));
      (useComponentInputs as jest.Mock).mockImplementation(() => mockInputs);

      const result = render(
        <CanvasNumberInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />
      );
      expect(result.container.querySelector('.Mui-error')).toBeNull();
    });
  });

  describe('event handlers', () => {
    it('passes event handlers to input', async () => {
      render(
        <CanvasNumberInput name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />
      );
      await userEvent.click(screen.getByRole('spinbutton'));
      expect(mockEventHandlerCallbacks.onClick).toHaveBeenCalled();
    });
  });
});
