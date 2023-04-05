import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AbiForm } from '../AbiForm';

const mockHandleDataChange = jest.fn();
const mockHandleNameChange = jest.fn();

describe('AbiForm', () => {
  describe('name', () => {
    it('renders label', () => {
      const result = render(
        <AbiForm
          name=""
          data={{ abi: '', isProxy: false }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(result.getByLabelText(/^Name/)).toBeTruthy();
    });

    it('renders placeholder', () => {
      const result = render(
        <AbiForm
          name=""
          data={{ abi: '', isProxy: false }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(result.getByPlaceholderText('Enter ABI name')).toBeTruthy();
    });

    it('renders value', () => {
      const mockName = 'name';
      const result = render(
        <AbiForm
          name={mockName}
          data={{ abi: '', isProxy: false }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(result.getByLabelText(/^Name/)).toHaveDisplayValue(mockName);
    });

    it('calls onNameChange on value change', async () => {
      const result = render(
        <AbiForm
          name=""
          data={{ abi: '', isProxy: false }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      const mockValue = 'a';
      await userEvent.type(result.getByLabelText(/^Name/), mockValue);
      expect(mockHandleNameChange).toHaveBeenCalledWith(mockValue);
    });
  });

  describe('ABI', () => {
    it('renders label', () => {
      const result = render(
        <AbiForm
          name=""
          data={{ abi: '', isProxy: false }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(result.getByLabelText(/^ABI/)).toBeTruthy();
    });

    it('renders placeholder', () => {
      const result = render(
        <AbiForm
          name=""
          data={{ abi: '', isProxy: false }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(result.getByPlaceholderText('Enter contract ABI')).toBeTruthy();
    });

    it('renders value', () => {
      const result = render(
        <AbiForm
          name=""
          data={{ abi: 'abi', isProxy: false }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(result.getByLabelText(/^ABI/)).toHaveDisplayValue('abi');
    });

    it('calls onDataChange on value change', async () => {
      const result = render(
        <AbiForm
          name=""
          data={{ abi: '', isProxy: false }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      const mockValue = 'a';
      await userEvent.type(result.getByLabelText(/^ABI/), mockValue);
      expect(mockHandleDataChange).toHaveBeenCalledWith({ abi: mockValue });
    });
  });

  describe('proxy', () => {
    it('renders label', () => {
      const result = render(
        <AbiForm
          name=""
          data={{ abi: '', isProxy: false }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(result.getByLabelText('Add logic ABI')).toBeTruthy();
    });

    it('renders value', () => {
      const result = render(
        <AbiForm
          name=""
          data={{ abi: '', isProxy: true }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(result.getByLabelText('Add logic ABI')).toBeChecked();
    });

    it('calls onDataChange on value change', async () => {
      const result = render(
        <AbiForm
          name=""
          data={{ abi: '', isProxy: false }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      await userEvent.click(result.getByLabelText('Add logic ABI'));
      expect(mockHandleDataChange).toHaveBeenCalledWith({ isProxy: true });
    });
  });

  describe('logic ABI', () => {
    it('hides logic ABI if not proxy', () => {
      const result = render(
        <AbiForm
          name=""
          data={{ abi: '', isProxy: false, logicAbi: '' }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(result.getByLabelText(/^Logic ABI/)).not.toBeVisible();
    });

    it('shows logic ABI if proxy', () => {
      const result = render(
        <AbiForm
          name=""
          data={{ abi: '', isProxy: true, logicAbi: '' }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(result.getByLabelText(/^Logic ABI/)).toBeVisible();
    });

    it('renders label', () => {
      const result = render(
        <AbiForm
          name=""
          data={{ abi: '', isProxy: true, logicAbi: '' }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(result.getByLabelText(/^Logic ABI/)).toBeTruthy();
    });

    it('renders placeholder', () => {
      const result = render(
        <AbiForm
          name=""
          data={{ abi: '', isProxy: true, logicAbi: '' }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(
        result.getByPlaceholderText('Enter logic contract ABI')
      ).toBeTruthy();
    });

    it('renders value', () => {
      const result = render(
        <AbiForm
          name=""
          data={{ abi: '', isProxy: true, logicAbi: 'logicAbi' }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(result.getByLabelText(/^Logic ABI/)).toHaveDisplayValue(
        'logicAbi'
      );
    });

    it('calls onDataChange on value change', async () => {
      const result = render(
        <AbiForm
          name=""
          data={{ abi: '', isProxy: true, logicAbi: '' }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      const mockValue = 'a';
      await userEvent.type(result.getByLabelText(/^Logic ABI/), mockValue);
      expect(mockHandleDataChange).toHaveBeenCalledWith({
        logicAbi: mockValue,
      });
    });
  });
});
