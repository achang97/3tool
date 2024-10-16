import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import { ResourceType } from '@app/types';
import { RESOURCE_CONFIGS, RESOURCE_DATA_TEMPLATES } from '@app/constants';
import { pushResource } from '@app/redux/features/resourcesSlice';
import { CreateResourceButton } from '../CreateResourceButton';

const mockDispatch = jest.fn();

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

describe('CreateResourceButton', () => {
  it('renders text', () => {
    render(<CreateResourceButton />);
    expect(screen.getByText('Add new resource')).toBeTruthy();
  });

  it.each([ResourceType.SmartContract, ResourceType.Abi])(
    'pushes new %s resource onto stack on click',
    async (resourceType: ResourceType) => {
      render(<CreateResourceButton />);

      await userEvent.click(screen.getByText('Add new resource'));
      await userEvent.click(screen.getByText(RESOURCE_CONFIGS[resourceType].label));

      expect(mockDispatch).toHaveBeenCalledWith(
        pushResource({
          type: 'create',
          resource: {
            name: '',
            type: resourceType,
            data: {
              [resourceType]: RESOURCE_DATA_TEMPLATES[resourceType],
            },
            _id: '',
            createdAt: '',
            updatedAt: '',
          },
        })
      );
    }
  );
});
