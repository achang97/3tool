import { useUpdateResourceMutation } from '@app/redux/services/resources';
import { ApiError, Resource, ResourceType } from '@app/types';
import userEvent from '@testing-library/user-event';
import { mockValidAddress } from '@tests/constants/data';
import { render } from '@tests/utils/renderWithContext';
import {
  mockApiErrorResponse,
  mockApiSuccessResponse,
} from '@tests/constants/api';
import { mainnet } from 'wagmi';
import { EditResourceDialog } from '../EditResourceDialog';

const mockHandleClose = jest.fn();
const mockHandleChange = jest.fn();
const mockUpdateResource = jest.fn();

const mockResource = {
  name: 'name',
  type: ResourceType.SmartContract,
  data: {
    smartContract: {
      address: mockValidAddress,
      chainId: mainnet.id,
      abiId: '1',
    },
  },
} as Resource;

jest.mock('../hooks/useFetchAbi', () => ({
  useFetchAbi: jest.fn(() => ({})),
}));

jest.mock('../hooks/useAbiResources', () => ({
  useAbiResources: jest.fn(() => []),
}));

jest.mock('@app/redux/services/resources', () => ({
  ...jest.requireActual('@app/redux/services/resources'),
  useUpdateResourceMutation: jest.fn(),
}));

describe('EditResourceDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useUpdateResourceMutation as jest.Mock).mockImplementation(() => [
      mockUpdateResource,
      {},
    ]);
  });

  it('renders title', () => {
    const result = render(
      <EditResourceDialog
        resource={mockResource}
        onClose={mockHandleClose}
        onChange={mockHandleChange}
        isOpen
        isBackButtonVisible
      />
    );
    expect(result.getByText(/Edit Resource/)).toBeTruthy();
  });

  it('renders error message', () => {
    const mockError: ApiError = {
      status: 400,
      data: {
        message: 'Mock Error',
      },
    };

    (useUpdateResourceMutation as jest.Mock).mockImplementation(() => [
      mockUpdateResource,
      { error: mockError },
    ]);

    const result = render(
      <EditResourceDialog
        resource={mockResource}
        onClose={mockHandleClose}
        onChange={mockHandleChange}
        isOpen
        isBackButtonVisible
      />
    );
    expect(result.getByText('Mock Error')).toBeTruthy();
  });

  it('calls onClose on successful update of resource', async () => {
    mockUpdateResource.mockImplementation(() => mockApiSuccessResponse);

    const result = render(
      <EditResourceDialog
        resource={mockResource}
        onClose={mockHandleClose}
        onChange={mockHandleChange}
        isOpen
        isBackButtonVisible
      />
    );
    await userEvent.click(result.getByText('Save'));
    expect(mockUpdateResource).toHaveBeenCalledWith(mockResource);
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it('does not call onClose on failed update of resource', async () => {
    mockUpdateResource.mockImplementation(() => mockApiErrorResponse);

    const result = render(
      <EditResourceDialog
        resource={mockResource}
        onClose={mockHandleClose}
        onChange={mockHandleChange}
        isOpen
        isBackButtonVisible
      />
    );
    await userEvent.click(result.getByText('Save'));
    expect(mockUpdateResource).toHaveBeenCalledWith(mockResource);
    expect(mockHandleClose).not.toHaveBeenCalled();
  });
});
