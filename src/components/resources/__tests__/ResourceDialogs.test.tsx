import { useAppSelector } from '@app/redux/hooks';
import { mockValidAddress } from '@tests/constants/data';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import userEvent from '@testing-library/user-event';
import { popResource, updateResource } from '@app/redux/features/resourcesSlice';
import { Resource, ResourceType } from '@app/types';
import { mainnet } from 'wagmi';
import { createMockApiSuccessResponse } from '@tests/constants/api';
import { ResourceDialogs } from '../ResourceDialogs';

const mockDispatch = jest.fn();
const mockCreateResource = jest.fn();

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
  useAppSelector: jest.fn(),
}));

jest.mock('@app/redux/services/resources', () => ({
  ...jest.requireActual('@app/redux/services/resources'),
  useCreateResourceMutation: jest.fn(() => [mockCreateResource, {}]),
  useGetResourcesQuery: jest.fn(() => ({ data: [] })),
}));

jest.mock('../hooks/useFetchAbi', () => ({
  useFetchAbi: jest.fn(() => ({})),
}));

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

describe('ResourceDialogs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation(() => ({}));
  });

  describe('create', () => {
    beforeEach(() => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        resourceStack: [{ type: 'create', resource: mockResource }],
      }));
    });

    it('renders create resource dialog', () => {
      render(<ResourceDialogs />);
      expect(screen.getByTestId('create-resource-dialog')).toBeTruthy();
    });

    it('dispatches action to update resource', async () => {
      render(<ResourceDialogs />);
      const mockValue = 'a';
      await userEvent.type(screen.getByLabelText(/^Name/), mockValue);
      expect(mockDispatch).toHaveBeenCalledWith(
        updateResource({
          index: 0,
          update: { name: `${mockResource.name}${mockValue}` },
        })
      );
    });

    it('dispatches action to pop resource on close', async () => {
      render(<ResourceDialogs />);
      await userEvent.keyboard('[Escape]');
      expect(mockDispatch).toHaveBeenCalledWith(popResource());
    });

    it('renders back button if stack has multiple elements', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        resourceStack: [
          { type: 'create', resource: mockResource },
          { type: 'create', resource: mockResource },
        ],
      }));
      render(<ResourceDialogs />);
      expect(screen.getByText('Go back')).toBeTruthy();
    });
  });

  describe('edit', () => {
    beforeEach(() => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        resourceStack: [{ type: 'edit', resource: mockResource }],
      }));
    });

    it('renders edit resource dialog', () => {
      render(<ResourceDialogs />);
      expect(screen.getByTestId('edit-resource-dialog')).toBeTruthy();
    });

    it('dispatches action to update resource', async () => {
      render(<ResourceDialogs />);
      const mockValue = 'a';
      await userEvent.type(screen.getByLabelText(/^Name/), mockValue);
      expect(mockDispatch).toHaveBeenCalledWith(
        updateResource({
          index: 0,
          update: { name: `${mockResource.name}${mockValue}` },
        })
      );
    });

    it('dispatches action to pop resource on close', async () => {
      render(<ResourceDialogs />);
      await userEvent.keyboard('[Escape]');
      expect(mockDispatch).toHaveBeenCalledWith(popResource());
    });

    it('renders back button if stack has multiple elements', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        resourceStack: [
          { type: 'edit', resource: mockResource },
          { type: 'edit', resource: mockResource },
        ],
      }));
      render(<ResourceDialogs />);
      expect(screen.getByText('Go back')).toBeTruthy();
    });
  });

  it('sets abi field on smart contract modal if abi was successfully created', async () => {
    mockCreateResource.mockImplementation(() =>
      createMockApiSuccessResponse({
        type: ResourceType.Abi,
        _id: 'newId',
      })
    );
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      resourceStack: [
        {
          type: 'create',
          resource: {
            name: 'newAbi',
            type: ResourceType.Abi,
            data: {
              abi: { abi: '[]', isProxy: false },
            },
          },
        },
        {
          type: 'create',
          resource: { type: ResourceType.SmartContract, data: {} },
        },
      ],
    }));
    render(<ResourceDialogs />);
    await userEvent.click(screen.getByText('Save'));
    expect(mockDispatch).toHaveBeenCalledWith(
      updateResource({
        index: 1,
        update: {
          data: {
            smartContract: {
              abiId: 'newId',
            },
          },
        },
      })
    );
  });

  it('renders null if resource stack is empty', () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      resourceStack: [],
    }));
    render(<ResourceDialogs />);
    expect(screen.getByTestId('resource-dialogs').firstChild).toBeNull();
  });
});
