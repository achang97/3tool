import { useCreateResourceMutation } from '@app/redux/services/resources';
import { ApiError, Resource, ResourceType } from '@app/types';
import userEvent from '@testing-library/user-event';
import { mockValidAddress } from '@tests/constants/data';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import { mockApiErrorResponse, mockApiSuccessResponse } from '@tests/constants/api';
import { mainnet } from 'wagmi';
import _ from 'lodash';
import { CreateResourceDialog } from '../CreateResourceDialog';

const mockHandleClose = jest.fn();
const mockHandleChange = jest.fn();
const mockHandleCreate = jest.fn();
const mockCreateResource = jest.fn();

const mockResource: Resource = {
  name: 'name',
  type: ResourceType.SmartContract,
  data: {
    smartContract: {
      address: mockValidAddress,
      chainId: mainnet.id,
      abiId: '1',
    },
  },
  _id: '',
  createdAt: '',
  updatedAt: '',
};

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
    (useCreateResourceMutation as jest.Mock).mockImplementation(() => [mockCreateResource, {}]);
  });

  it('renders title', () => {
    render(
      <CreateResourceDialog
        resource={mockResource}
        onClose={mockHandleClose}
        onChange={mockHandleChange}
        onCreate={mockHandleCreate}
        isOpen
        isBackButtonVisible
      />
    );
    expect(screen.getByText(/Add Resource/)).toBeTruthy();
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

    render(
      <CreateResourceDialog
        resource={mockResource}
        onClose={mockHandleClose}
        onChange={mockHandleChange}
        onCreate={mockHandleCreate}
        isOpen
        isBackButtonVisible
      />
    );
    expect(screen.getByText('Mock Error')).toBeTruthy();
  });

  it('calls create API without _id, updatedAt, and createdAt field', async () => {
    render(
      <CreateResourceDialog
        resource={mockResource}
        onClose={mockHandleClose}
        onChange={mockHandleChange}
        onCreate={mockHandleCreate}
        isOpen
        isBackButtonVisible
      />
    );
    await userEvent.click(screen.getByText('Save'));
    expect(mockCreateResource).toHaveBeenCalledWith(
      _.omit(mockResource, ['_id', 'createdAt', 'updatedAt'])
    );
  });

  it('calls onCreate and onClose on successful creation of resource', async () => {
    mockCreateResource.mockImplementation(() => mockApiSuccessResponse);

    render(
      <CreateResourceDialog
        resource={mockResource}
        onClose={mockHandleClose}
        onChange={mockHandleChange}
        onCreate={mockHandleCreate}
        isOpen
        isBackButtonVisible
      />
    );
    await userEvent.click(screen.getByText('Save'));
    expect(mockHandleCreate).toHaveBeenCalledWith(mockApiSuccessResponse.unwrap());
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it('does not call onCreate and onClose on failed creation of resource', async () => {
    mockCreateResource.mockImplementation(() => mockApiErrorResponse);

    render(
      <CreateResourceDialog
        resource={mockResource}
        onClose={mockHandleClose}
        onChange={mockHandleChange}
        onCreate={mockHandleCreate}
        isOpen
        isBackButtonVisible
      />
    );
    await userEvent.click(screen.getByText('Save'));
    expect(mockHandleCreate).not.toHaveBeenCalled();
    expect(mockHandleClose).not.toHaveBeenCalled();
  });
});
