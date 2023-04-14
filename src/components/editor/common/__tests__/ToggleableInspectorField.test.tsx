import { screen, waitFor } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import { ToggleableInspectorField } from '../ToggleableInspectorField';

const mockLabel = 'label';
const mockTooltip = 'tooltip';
const mockValue = 'value';
const mockHandleChange = jest.fn();
const mockHandleIsDynamicToggle = jest.fn();
const mockTestId = 'test-id';
const mockChildren = jest.fn(
  (props: { label?: ReactNode; value?: any; onChange: (newValue: any) => void }) => (
    <div data-testid="mock-children">
      <div>{props.label}</div>
    </div>
  )
);

jest.mock('@app/components/editor/hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => jest.fn()),
}));

describe('ToggleableInspectorField', () => {
  describe('dynamic input', () => {
    it('displays form field label with tooltip', async () => {
      render(
        <ToggleableInspectorField
          label={mockLabel}
          tooltip={mockTooltip}
          value={mockValue}
          testId={mockTestId}
          onChange={mockHandleChange}
          dynamicType="string"
          onIsDynamicToggle={mockHandleIsDynamicToggle}
          isDynamic
        >
          {mockChildren}
        </ToggleableInspectorField>
      );
      expect(screen.getByText(mockLabel)).toBeTruthy();

      await userEvent.hover(screen.getByTestId('help-tooltip-icon'));
      await waitFor(() => {
        expect(screen.getByText(mockTooltip)).toBeTruthy();
      });
    });

    it('displays toggled "Get via JavaScript" switch', async () => {
      render(
        <ToggleableInspectorField
          label={mockLabel}
          tooltip={mockTooltip}
          value={mockValue}
          testId={mockTestId}
          onChange={mockHandleChange}
          dynamicType="string"
          onIsDynamicToggle={mockHandleIsDynamicToggle}
          isDynamic
        >
          {mockChildren}
        </ToggleableInspectorField>
      );
      expect(screen.getByRole('checkbox')).toBeChecked();

      await userEvent.click(screen.getByRole('checkbox'));
      expect(mockHandleIsDynamicToggle).toHaveBeenCalledWith(false);
    });

    it('displays text field and fires on change', async () => {
      render(
        <ToggleableInspectorField
          label={mockLabel}
          tooltip={mockTooltip}
          value={mockValue}
          testId={mockTestId}
          onChange={mockHandleChange}
          dynamicType="string"
          onIsDynamicToggle={mockHandleIsDynamicToggle}
          isDynamic
        >
          {mockChildren}
        </ToggleableInspectorField>
      );

      expect(screen.getByText(mockValue)).toBeTruthy();
      expect(screen.getByRole('textbox')).toBeTruthy();

      await userEvent.type(screen.getByRole('textbox'), 'a');
      expect(mockHandleChange).toHaveBeenCalledWith(`a${mockValue}`, expect.anything());
    });
  });

  describe('base element', () => {
    it('displays form field label with tooltip', async () => {
      render(
        <ToggleableInspectorField
          label={mockLabel}
          tooltip={mockTooltip}
          value={mockValue}
          testId={mockTestId}
          onChange={mockHandleChange}
          dynamicType="string"
          onIsDynamicToggle={mockHandleIsDynamicToggle}
          isDynamic={false}
        >
          {mockChildren}
        </ToggleableInspectorField>
      );
      expect(screen.getByText(mockLabel)).toBeTruthy();

      await userEvent.hover(screen.getByTestId('help-tooltip-icon'));
      await waitFor(() => {
        expect(screen.getByText(mockTooltip)).toBeTruthy();
      });
    });

    it('displays untoggled "Get via JavaScript" switch', async () => {
      render(
        <ToggleableInspectorField
          label={mockLabel}
          tooltip={mockTooltip}
          value={mockValue}
          testId={mockTestId}
          onChange={mockHandleChange}
          dynamicType="string"
          onIsDynamicToggle={mockHandleIsDynamicToggle}
          isDynamic={false}
        >
          {mockChildren}
        </ToggleableInspectorField>
      );
      expect(screen.getByRole('checkbox')).not.toBeChecked();

      await userEvent.click(screen.getByRole('checkbox'));
      expect(mockHandleIsDynamicToggle).toHaveBeenCalledWith(true);
    });

    it('displays children element', () => {
      render(
        <ToggleableInspectorField
          label={mockLabel}
          tooltip={mockTooltip}
          value={mockValue}
          testId={mockTestId}
          onChange={mockHandleChange}
          dynamicType="string"
          onIsDynamicToggle={mockHandleIsDynamicToggle}
          isDynamic={false}
        >
          {mockChildren}
        </ToggleableInspectorField>
      );
      expect(mockChildren).toHaveBeenCalledWith(
        expect.objectContaining({
          value: mockValue,
          onChange: mockHandleChange,
          testId: mockTestId,
        })
      );
      expect(screen.getByTestId('mock-children')).toBeTruthy();
    });
  });
});
