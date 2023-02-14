import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockValidAddress } from '@tests/constants/data';
import { useFetchAbi } from '../../hooks/useFetchAbi';
import {
  AddressAbiFieldGroup,
  GroupTextFieldProps,
} from '../AddressAbiFieldGroup';

const mockChainId = 1;
const mockAddressTextFieldProps: GroupTextFieldProps = {
  label: 'Address',
  placeholder: 'Enter address',
  onChange: jest.fn(),
};
const mockAbiTextFieldProps: GroupTextFieldProps = {
  label: 'ABI',
  placeholder: 'Enter ABI',
  onChange: jest.fn(),
};

const mockAbi = '[]';

jest.mock('@app/utils/contracts');
jest.mock('../../hooks/useFetchAbi');

describe('AddressAbiFieldGroup', () => {
  const addressTextFieldId = 'address-text-field';
  const abiTextFieldId = 'abi-text-field';

  beforeEach(() => {
    jest.clearAllMocks();
    (useFetchAbi as jest.Mock).mockImplementation(() => ({}));
  });

  describe('address', () => {
    it('renders address label', () => {
      const result = render(
        <AddressAbiFieldGroup
          address={mockValidAddress}
          abi={mockAbi}
          chainId={mockChainId}
          addressTextFieldProps={mockAddressTextFieldProps}
          abiTextFieldProps={mockAbiTextFieldProps}
        />
      );
      expect(
        result.getByLabelText(mockAddressTextFieldProps.label)
      ).toBeTruthy();
    });

    it('renders address placeholder', () => {
      const result = render(
        <AddressAbiFieldGroup
          address={mockValidAddress}
          abi={mockAbi}
          chainId={mockChainId}
          addressTextFieldProps={mockAddressTextFieldProps}
          abiTextFieldProps={mockAbiTextFieldProps}
        />
      );
      expect(
        result.getByPlaceholderText(mockAddressTextFieldProps.placeholder)
      ).toBeTruthy();
    });

    it('fires address onChange and resets ABI when entering input', async () => {
      const result = render(
        <AddressAbiFieldGroup
          address={mockValidAddress}
          abi={mockAbi}
          chainId={mockChainId}
          addressTextFieldProps={mockAddressTextFieldProps}
          abiTextFieldProps={mockAbiTextFieldProps}
        />
      );

      const mockInputValue = 'a';
      await userEvent.type(
        result.getByLabelText(mockAddressTextFieldProps.label),
        mockInputValue
      );

      expect(mockAddressTextFieldProps.onChange).toHaveBeenCalledWith(
        `${mockValidAddress}${mockInputValue}`
      );
      expect(mockAbiTextFieldProps.onChange).toHaveBeenCalledWith('');
    });

    it('sets address as required field', async () => {
      const result = render(
        <AddressAbiFieldGroup
          address={mockValidAddress}
          abi={mockAbi}
          chainId={mockChainId}
          addressTextFieldProps={mockAddressTextFieldProps}
          abiTextFieldProps={mockAbiTextFieldProps}
          required
        />
      );
      expect(result.getByTestId(addressTextFieldId)).toBeRequired();
    });

    describe('error', () => {
      it('renders "Invalid address" error if address is invalid', () => {
        const result = render(
          <AddressAbiFieldGroup
            address="Invalid Address"
            abi={mockAbi}
            chainId={mockChainId}
            addressTextFieldProps={mockAddressTextFieldProps}
            abiTextFieldProps={mockAbiTextFieldProps}
            required
          />
        );
        expect(result.getByText('Invalid address')).toBeTruthy();
      });

      it('renders error from fetching ABI', () => {
        (useFetchAbi as jest.Mock).mockImplementation(() => ({
          error: new Error('Error message'),
        }));

        const result = render(
          <AddressAbiFieldGroup
            address={mockValidAddress}
            abi={mockAbi}
            chainId={mockChainId}
            addressTextFieldProps={mockAddressTextFieldProps}
            abiTextFieldProps={mockAbiTextFieldProps}
            required
          />
        );
        expect(result.getByText('Error message')).toBeTruthy();
      });
    });
  });

  describe('abi', () => {
    it('renders ABI label', () => {
      const result = render(
        <AddressAbiFieldGroup
          address={mockValidAddress}
          abi={mockAbi}
          chainId={mockChainId}
          addressTextFieldProps={mockAddressTextFieldProps}
          abiTextFieldProps={mockAbiTextFieldProps}
        />
      );
      expect(result.getByLabelText(mockAbiTextFieldProps.label)).toBeTruthy();
    });

    it('renders ABI placeholder', () => {
      const result = render(
        <AddressAbiFieldGroup
          address={mockValidAddress}
          abi={mockAbi}
          chainId={mockChainId}
          addressTextFieldProps={mockAddressTextFieldProps}
          abiTextFieldProps={mockAbiTextFieldProps}
        />
      );
      expect(
        result.getByPlaceholderText(mockAbiTextFieldProps.placeholder)
      ).toBeTruthy();
    });

    it('fires ABI onChange when entering input', async () => {
      const result = render(
        <AddressAbiFieldGroup
          address={mockValidAddress}
          abi={mockAbi}
          chainId={mockChainId}
          addressTextFieldProps={mockAddressTextFieldProps}
          abiTextFieldProps={mockAbiTextFieldProps}
        />
      );

      const mockInputValue = 'a';
      await userEvent.type(
        result.getByLabelText(mockAbiTextFieldProps.label),
        mockInputValue
      );

      expect(mockAbiTextFieldProps.onChange).toHaveBeenCalledWith(
        `${mockAbi}${mockInputValue}`
      );
    });

    it('sets ABI required field', async () => {
      const result = render(
        <AddressAbiFieldGroup
          address={mockValidAddress}
          abi={mockAbi}
          chainId={mockChainId}
          addressTextFieldProps={mockAddressTextFieldProps}
          abiTextFieldProps={mockAbiTextFieldProps}
          required
        />
      );
      expect(result.getByTestId(abiTextFieldId)).toBeRequired();
    });

    describe('error', () => {
      it('renders "Invalid JSON" error if ABI is invalid', () => {
        const result = render(
          <AddressAbiFieldGroup
            address={mockValidAddress}
            abi="["
            chainId={mockChainId}
            addressTextFieldProps={mockAddressTextFieldProps}
            abiTextFieldProps={mockAbiTextFieldProps}
            required
          />
        );
        expect(result.getByText('Invalid JSON')).toBeTruthy();
      });
    });
  });

  describe('conditional rendering', () => {
    it('does not show ABI if address is invalid', () => {
      const result = render(
        <AddressAbiFieldGroup
          address="Invalid Address"
          abi={mockAbi}
          chainId={mockChainId}
          addressTextFieldProps={mockAddressTextFieldProps}
          abiTextFieldProps={mockAbiTextFieldProps}
        />
      );
      expect(result.getByTestId(abiTextFieldId)).not.toBeVisible();
    });

    it('does not show ABI if fetching ABI failed', () => {
      (useFetchAbi as jest.Mock).mockImplementation(() => ({
        error: new Error('Some error'),
      }));

      const result = render(
        <AddressAbiFieldGroup
          address={mockValidAddress}
          abi={mockAbi}
          chainId={mockChainId}
          addressTextFieldProps={mockAddressTextFieldProps}
          abiTextFieldProps={mockAbiTextFieldProps}
        />
      );
      expect(result.getByTestId(abiTextFieldId)).not.toBeVisible();
    });

    it('does not show ABI if currently fetching', () => {
      (useFetchAbi as jest.Mock).mockImplementation(() => ({
        isLoading: true,
      }));

      const result = render(
        <AddressAbiFieldGroup
          address={mockValidAddress}
          abi={mockAbi}
          chainId={mockChainId}
          addressTextFieldProps={mockAddressTextFieldProps}
          abiTextFieldProps={mockAbiTextFieldProps}
        />
      );
      expect(result.getByTestId(abiTextFieldId)).not.toBeVisible();
    });

    it('shows ABI if address is valid and ABI has been fetched', () => {
      (useFetchAbi as jest.Mock).mockImplementation(() => ({
        isLoading: false,
        error: undefined,
      }));

      const result = render(
        <AddressAbiFieldGroup
          address={mockValidAddress}
          abi={mockAbi}
          chainId={mockChainId}
          addressTextFieldProps={mockAddressTextFieldProps}
          abiTextFieldProps={mockAbiTextFieldProps}
        />
      );
      expect(result.getByTestId(abiTextFieldId)).toBeVisible();
    });
  });
});
