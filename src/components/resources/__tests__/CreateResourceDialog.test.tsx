import { useCreateResourceMutation } from '@app/redux/services/resources';
import { ApiError, Resource, ResourceType } from '@app/types';
import userEvent from '@testing-library/user-event';
import { mockValidAddress } from '@tests/constants/data';
import { render } from '@tests/utils/renderWithContext';
import {
  mockApiErrorResponse,
  mockApiSuccessResponse,
} from '@tests/constants/api';
import { mainnet } from 'wagmi';
import { CreateResourceDialog } from '../CreateResourceDialog';

const mockHandleClose = jest.fn();
const mockHandleChange = jest.fn();
const mockHandleCreate = jest.fn();
const mockCreateResource = jest.fn();

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
  useCreateResourceMutation: jest.fn(),
}));

describe('CreateResourceDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useCreateResourceMutation as jest.Mock).mockImplementation(() => [
      mockCreateResource,
      {},
    ]);
  });

  it('renders title', () => {
    const result = render(
      <CreateResourceDialog
        resource={mockResource}
        onClose={mockHandleClose}
        onChange={mockHandleChange}
        onCreate={mockHandleCreate}
        isOpen
        isBackButtonVisible
      />
    );
    expect(result.getByText(/Add Resource/)).toBeTruthy();
  });

  it('renders error message', () => {
    const mockError: ApiError = {
      status: 400,
      data: {
        message: 'Mock Error',
      },
    };

    (useCreateResourceMutation as jest.Mock).mockImplementation(() => [
      mockCreateResource,
      { error: mockError },
    ]);

    const result = render(
      <CreateResourceDialog
        resource={mockResource}
        onClose={mockHandleClose}
        onChange={mockHandleChange}
        onCreate={mockHandleCreate}
        isOpen
        isBackButtonVisible
      />
    );
    expect(result.getByText('Mock Error')).toBeTruthy();
  });

  it('calls onCreate and onClose on successful creation of resource', async () => {
    mockCreateResource.mockImplementation(() => mockApiSuccessResponse);

    const result = render(
      <CreateResourceDialog
        resource={mockResource}
        onClose={mockHandleClose}
        onChange={mockHandleChange}
        onCreate={mockHandleCreate}
        isOpen
        isBackButtonVisible
      />
    );
    await userEvent.click(result.getByText('Save'));
    expect(mockCreateResource).toHaveBeenCalledWith(mockResource);
    expect(mockHandleCreate).toHaveBeenCalledWith(mockApiSuccessResponse.data);
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it('does not call onCreate and onClose on failed creation of resource', async () => {
    mockCreateResource.mockImplementation(() => mockApiErrorResponse);

    const result = render(
      <CreateResourceDialog
        resource={mockResource}
        onClose={mockHandleClose}
        onChange={mockHandleChange}
        onCreate={mockHandleCreate}
        isOpen
        isBackButtonVisible
      />
    );
    await userEvent.click(result.getByText('Save'));
    expect(mockCreateResource).toHaveBeenCalledWith(mockResource);
    expect(mockHandleCreate).not.toHaveBeenCalled();
    expect(mockHandleClose).not.toHaveBeenCalled();
  });
});
