import { ApiError, Resource, ResourceType } from '@app/types';
import userEvent from '@testing-library/user-event';
import { mockValidAddress } from '@tests/constants/data';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import { mainnet } from 'wagmi';
import { RESOURCE_CONFIGS, RESOURCE_DATA_TEMPLATES } from '@app/constants';
import { BaseResourceDialog } from '../BaseResourceDialog';

const mockTitle = 'Dialog title';
const mockHandleSubmit = jest.fn();
const mockHandleClose = jest.fn();
const mockHandleChange = jest.fn();
const mockTestId = 'test-id';

const mockResource = {
  name: 'resource1',
  type: ResourceType.Abi,
  data: {
    abi: {},
  },
} as Resource;

jest.mock('../hooks/useAbiResources', () => ({
  useAbiResources: jest.fn(() => []),
}));

describe('BaseResourceDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('dialog', () => {
    it('does not render dialog', () => {
      render(
        <BaseResourceDialog
          title={mockTitle}
          resource={mockResource}
          onClose={mockHandleClose}
          onSubmit={mockHandleSubmit}
          onChange={mockHandleChange}
          isOpen={false}
          isBackButtonVisible
          testId={mockTestId}
        />
      );
      expect(screen.queryByTestId(mockTestId)).toBeNull();
    });

    it('calls onClose when dialog is closed', async () => {
      render(
        <BaseResourceDialog
          title={mockTitle}
          resource={mockResource}
          onClose={mockHandleClose}
          onSubmit={mockHandleSubmit}
          onChange={mockHandleChange}
          isOpen
          isBackButtonVisible
          testId={mockTestId}
        />
      );

      await userEvent.keyboard('[Escape]');
      expect(mockHandleClose).toHaveBeenCalled();
    });

    it('renders title', () => {
      render(
        <BaseResourceDialog
          title={mockTitle}
          resource={mockResource}
          onClose={mockHandleClose}
          onSubmit={mockHandleSubmit}
          onChange={mockHandleChange}
          isOpen
          isBackButtonVisible
          testId={mockTestId}
        />
      );
      expect(
        screen.getByText(`${mockTitle} | ${RESOURCE_CONFIGS[mockResource.type].label}`)
      ).toBeTruthy();
    });
  });

  describe('content', () => {
    it('renders error message', () => {
      const mockError: ApiError = {
        status: 400,
        data: {
          message: 'Mock Error',
        },
      };

      render(
        <BaseResourceDialog
          title={mockTitle}
          resource={mockResource}
          onClose={mockHandleClose}
          onSubmit={mockHandleSubmit}
          onChange={mockHandleChange}
          isOpen
          isBackButtonVisible
          error={mockError}
          testId={mockTestId}
        />
      );
      expect(screen.getByText('Mock Error')).toBeTruthy();
    });

    it.each`
      resourceType                  | testId
      ${ResourceType.SmartContract} | ${'smart-contract-form'}
      ${ResourceType.Abi}           | ${'abi-form'}
    `(
      'renders $testId for $resourceType resource',
      ({ resourceType, testId }: { resourceType: ResourceType; testId: string }) => {
        render(
          <BaseResourceDialog
            title={mockTitle}
            resource={
              {
                name: '',
                type: resourceType,
                data: {
                  [resourceType]: RESOURCE_DATA_TEMPLATES[resourceType],
                },
              } as Resource
            }
            onClose={mockHandleClose}
            onSubmit={mockHandleSubmit}
            onChange={mockHandleChange}
            isOpen
            isBackButtonVisible
            testId={mockTestId}
          />
        );
        expect(screen.getByTestId(testId)).toBeTruthy();
      }
    );

    it('calls onChange with name', async () => {
      render(
        <BaseResourceDialog
          title={mockTitle}
          resource={
            {
              name: '',
              type: ResourceType.SmartContract,
              data: {
                smartContract: RESOURCE_DATA_TEMPLATES.smartContract,
              },
            } as Resource
          }
          onClose={mockHandleClose}
          onSubmit={mockHandleSubmit}
          onChange={mockHandleChange}
          isOpen
          isBackButtonVisible
          testId={mockTestId}
        />
      );
      const mockValue = 'a';
      await userEvent.type(screen.getByLabelText(/^Name/), mockValue);
      expect(mockHandleChange).toHaveBeenCalledWith({ name: mockValue });
    });

    it('calls onChange with data', async () => {
      render(
        <BaseResourceDialog
          title={mockTitle}
          resource={
            {
              name: '',
              type: ResourceType.SmartContract,
              data: {
                smartContract: RESOURCE_DATA_TEMPLATES.smartContract,
              },
            } as Resource
          }
          onClose={mockHandleClose}
          onSubmit={mockHandleSubmit}
          onChange={mockHandleChange}
          isOpen
          isBackButtonVisible
          testId={mockTestId}
        />
      );
      const mockValue = 'a';
      await userEvent.type(screen.getByLabelText(/^Address/), mockValue);
      expect(mockHandleChange).toHaveBeenCalledWith({
        data: {
          [ResourceType.SmartContract]: { address: mockValue },
        },
      });
    });
  });

  describe('actions', () => {
    it('renders "Go back" button to close dialog', async () => {
      render(
        <BaseResourceDialog
          title={mockTitle}
          resource={mockResource}
          onClose={mockHandleClose}
          onSubmit={mockHandleSubmit}
          onChange={mockHandleChange}
          isOpen
          isBackButtonVisible
          testId={mockTestId}
        />
      );
      await userEvent.click(screen.getByText('Go back'));
      expect(mockHandleClose).toHaveBeenCalled();
    });

    it('does not render "Go back" button', () => {
      render(
        <BaseResourceDialog
          title={mockTitle}
          resource={mockResource}
          onClose={mockHandleClose}
          onSubmit={mockHandleSubmit}
          onChange={mockHandleChange}
          isOpen
          isBackButtonVisible={false}
          testId={mockTestId}
        />
      );
      expect(screen.queryByText('Go back')).toBeNull();
    });

    it('does not call onSubmit if validation fails', async () => {
      render(
        <BaseResourceDialog
          title={mockTitle}
          resource={
            {
              type: ResourceType.SmartContract,
              data: { smartContract: { address: 'invalidAddress' } },
            } as Resource
          }
          onClose={mockHandleClose}
          onSubmit={mockHandleSubmit}
          onChange={mockHandleChange}
          isOpen
          isBackButtonVisible
          testId={mockTestId}
        />
      );
      expect(screen.getByText('Save')).toBeDisabled();
    });

    it('calls onSubmit on Save button click', async () => {
      render(
        <BaseResourceDialog
          title={mockTitle}
          resource={
            {
              _id: 'id',
              name: 'name',
              type: ResourceType.SmartContract,
              data: {
                smartContract: {
                  address: mockValidAddress,
                  chainId: mainnet.id,
                  abiId: '1',
                },
              },
            } as Resource
          }
          onClose={mockHandleClose}
          onSubmit={mockHandleSubmit}
          onChange={mockHandleChange}
          isOpen
          isBackButtonVisible
          testId={mockTestId}
        />
      );
      await userEvent.click(screen.getByText('Save'));
      expect(mockHandleSubmit).toHaveBeenCalled();
    });
  });
});
