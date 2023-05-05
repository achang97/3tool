import { useDeleteResourceMutation } from '@app/redux/services/resources';
import { ResourceWithLinkedActions } from '@app/types';
import userEvent from '@testing-library/user-event';
import {
  mockLinkedActionJavascript,
  mockLinkedActionSmartContractRead,
  mockSmartContractResource,
} from '@tests/constants/data';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import { mockApiSuccessResponse } from '@tests/constants/api';
import { textContentMatcher } from '@tests/utils/testingLibraryCustomMatchers';
import { DeleteResourceDialog } from '../DeleteResourceDialog';

jest.mock('@app/redux/services/resources', () => ({
  ...jest.requireActual('@app/redux/services/resources'),
  useDeleteResourceMutation: jest.fn(),
}));

const mockDeleteResource = jest.fn() as jest.MockWithArgs<
  ReturnType<typeof useDeleteResourceMutation>[0]
>;
const mockHandleClose = jest.fn();

const mockResourceWith0Actions: ResourceWithLinkedActions = {
  ...mockSmartContractResource,
  linkedActions: undefined,
};

const mockResourceWith1Action: ResourceWithLinkedActions = {
  ...mockSmartContractResource,
  linkedActions: [mockLinkedActionJavascript],
};

const mockResourceWith2Actions: ResourceWithLinkedActions = {
  ...mockSmartContractResource,
  linkedActions: [mockLinkedActionJavascript, mockLinkedActionSmartContractRead],
};

describe('DeleteResourceDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useDeleteResourceMutation as jest.Mock).mockImplementation(() => [mockDeleteResource, {}]);
  });

  it('passes entityType prop as "resource" to the BaseResourceDialog ', () => {
    render(
      <DeleteResourceDialog resource={mockResourceWith0Actions} onClose={mockHandleClose} isOpen />
    );

    expect(screen.getByRole('dialog', { name: /delete resource/i })).toBeVisible();
    expect(
      screen.getByText(/are you sure you want to permanently delete this resource\?/i)
    ).toBeVisible();
  });

  describe('confirmation textbox', () => {
    it('does not render confirmation textbox for resource with 0 linked actions, ', () => {
      render(
        <DeleteResourceDialog
          resource={mockResourceWith0Actions}
          onClose={mockHandleClose}
          isOpen
        />
      );

      expect(
        screen.queryByRole('textbox', {
          name: /type the name of the resource to confirm deletion/i,
        })
      ).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /yes, delete it\./i })).toBeEnabled();
    });

    it('renders a confirmation textbox for resource with 1 or more linked actions', () => {
      render(
        <DeleteResourceDialog resource={mockResourceWith1Action} onClose={mockHandleClose} isOpen />
      );

      expect(
        screen.getByRole('textbox', {
          name: /type the name of the resource to confirm deletion/i,
        })
      ).toBeVisible();
      expect(screen.getByRole('button', { name: /yes, delete it\./i })).toBeDisabled();
    });
  });

  describe('customBody', () => {
    it('does not render customBody for resource with 0 linked actions, ', () => {
      render(
        <DeleteResourceDialog
          resource={mockResourceWith0Actions}
          onClose={mockHandleClose}
          isOpen
        />
      );

      expect(
        screen.queryByText(
          textContentMatcher(
            new RegExp(`${mockResourceWith0Actions.name} is being used in 0 apps.`, 'i')
          )
        )
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(
          /once deleted, all actions on top of this resource will be removed from your applications\./i
        )
      ).not.toBeInTheDocument();
    });

    it('renders customBody in plural form for resource with 2 or more linked action', () => {
      render(
        <DeleteResourceDialog
          resource={mockResourceWith2Actions}
          onClose={mockHandleClose}
          isOpen
        />
      );

      expect(
        screen.getByText(
          textContentMatcher(
            new RegExp(`${mockResourceWith2Actions.name} is being used in 2 apps.`, 'i')
          )
        )
      ).toBeVisible();
      expect(
        screen.getByText(
          /once deleted, all actions on top of this resource will be removed from your applications\./i
        )
      ).toBeVisible();
    });

    it('renders customBody message in singular form for resource with exactly 1 linked action', () => {
      render(
        <DeleteResourceDialog resource={mockResourceWith1Action} onClose={mockHandleClose} isOpen />
      );

      expect(
        screen.getByText(
          textContentMatcher(
            new RegExp(`${mockResourceWith1Action.name} is being used in 1 app.`, 'i')
          )
        )
      ).toBeVisible();
      expect(
        screen.getByText(
          /once deleted, all actions on top of this resource will be removed from your applications\./i
        )
      ).toBeVisible();
    });
  });

  describe('Action button click', () => {
    it('calls deleteResource with correct props on "Yes, delete it" button click', async () => {
      mockDeleteResource.mockImplementation(
        (() => mockApiSuccessResponse) as unknown as typeof mockDeleteResource
      );
      render(
        <DeleteResourceDialog
          resource={mockResourceWith0Actions}
          onClose={mockHandleClose}
          isOpen
        />
      );

      await userEvent.click(screen.getByRole('button', { name: /yes, delete it\./i }));

      expect(mockDeleteResource).toHaveBeenCalledWith<Parameters<typeof mockDeleteResource>>({
        _id: mockResourceWith0Actions._id,
      });
      expect(mockHandleClose).toHaveBeenCalled();
    });
  });
});
