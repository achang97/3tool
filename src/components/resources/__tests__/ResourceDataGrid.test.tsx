import { Resource } from '@app/types';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useGetResourcesQuery } from '@app/redux/services/resources';
import { render } from '@tests/utils/renderWithContext';
import { store } from '@app/redux/store';
import { setActiveResource } from '@app/redux/features/resourcesSlice';
import {
  mockDuneResource,
  mockSmartContractResource,
} from '@tests/constants/data';
import { ResourceDataGrid } from '../ResourceDataGrid';

const dispatchSpy = jest.spyOn(store, 'dispatch');

const mockResources: Resource[] = [
  {
    ...mockSmartContractResource,
    createdAt: '2023-01-05T02:37:30.083Z',
  },
  {
    ...mockDuneResource,
    createdAt: '2023-01-05T02:33:30.083Z',
  },
];

jest.mock('@app/redux/services/resources', () => ({
  ...jest.requireActual('@app/redux/services/resources'),
  useGetResourcesQuery: jest.fn(() => ({ data: mockResources })),
}));

describe('ResourceDataGrid', () => {
  it('queries resources with input value', async () => {
    const result = render(<ResourceDataGrid />);

    const input = result.getByTestId('resource-data-grid-search-input');

    await userEvent.type(input, 'abc');

    await waitFor(() => {
      expect(useGetResourcesQuery).toHaveBeenCalledWith('abc', {
        refetchOnMountOrArgChange: true,
      });
    });
  });

  it('renders columns', () => {
    const result = render(<ResourceDataGrid />);

    expect(result.getByText('Type')).toBeTruthy();
    expect(result.getByText('Resource')).toBeTruthy();
    expect(result.getByText('Created At')).toBeTruthy();
    expect(result.getByText('Linked Queries')).toBeTruthy();
  });

  it('renders resources as rows in data grid', () => {
    const result = render(<ResourceDataGrid />);

    // Check first row
    expect(result.getByText('Smart contract')).toBeTruthy();
    expect(result.getByText(mockResources[0].name)).toBeTruthy();
    expect(
      result.getByText(`(${mockResources[0].data.smartContract?.address})`)
    ).toBeTruthy();
    expect(result.getByText('Jan 5, 2023 2:37 AM')).toBeTruthy();
    expect(result.getByText(mockResources[0].numLinkedQueries)).toBeTruthy();

    // Check second row
    expect(result.getByText('Dune')).toBeTruthy();
    expect(result.getByText(mockResources[1].name)).toBeTruthy();
    expect(result.getByText('Jan 5, 2023 2:33 AM')).toBeTruthy();
    expect(result.getByText(mockResources[1].numLinkedQueries)).toBeTruthy();
  });

  it('opens and closes edit dialog', async () => {
    const result = render(<ResourceDataGrid />);

    const moreButtons = result.getAllByTestId('MoreVertIcon');
    await userEvent.click(moreButtons[0]);

    const editButton = await result.findByText('Edit');
    await userEvent.click(editButton);
    expect(await result.findByTestId('edit-resource-dialog')).toBeTruthy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      setActiveResource(mockResources[0])
    );

    await userEvent.keyboard('[Escape]');
    expect(result.queryByTestId('edit-resource-dialog')).toBeNull();
    expect(dispatchSpy).toHaveBeenCalledWith(setActiveResource(undefined));
  });
});
