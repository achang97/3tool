import { Resource } from '@app/types';
import { render, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockSmartContractResource } from '@tests/constants/data';
import { ReactNode } from 'react';
import { pushResource } from '@app/redux/features/resourcesSlice';
import {
  formatCreatedAt,
  formatResourceType,
  renderNameCell,
} from '../../utils/dataGridFormatters';
import { useResourceDataGridProps } from '../useResourceDataGridProps';

const mockDispatch = jest.fn();
const mockResources: Resource[] = [mockSmartContractResource];

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

describe('useResourceDataGridProps', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rows', () => {
    it('returns empty array if resources is undefined', () => {
      const { result } = renderHook(() => useResourceDataGridProps(undefined));
      expect(result.current.rows).toEqual([]);
    });

    it('returns resources array', () => {
      const { result } = renderHook(() =>
        useResourceDataGridProps(mockResources)
      );
      expect(result.current.rows).toEqual(mockResources);
    });
  });

  describe('columns', () => {
    it('returns type as 1st column', () => {
      const { result } = renderHook(() =>
        useResourceDataGridProps(mockResources)
      );
      expect(result.current.columns[0]).toEqual({
        field: 'type',
        headerName: 'Type',
        valueFormatter: formatResourceType,
        flex: 1,
      });
    });

    it('returns name as 2nd column', () => {
      const { result } = renderHook(() =>
        useResourceDataGridProps(mockResources)
      );
      expect(result.current.columns[1]).toEqual({
        field: 'name',
        headerName: 'Resource',
        renderCell: renderNameCell,
        flex: 2,
      });
    });

    it('returns created at date as 3rd column', () => {
      const { result } = renderHook(() =>
        useResourceDataGridProps(mockResources)
      );
      expect(result.current.columns[2]).toEqual({
        field: 'createdAt',
        headerName: 'Created At',
        type: 'dateTime',
        flex: 1,
        valueFormatter: formatCreatedAt,
      });
    });

    it('returns actions as 4th column', () => {
      const { result } = renderHook(() =>
        useResourceDataGridProps(mockResources)
      );
      expect(result.current.columns[3]).toEqual({
        field: 'actions',
        type: 'actions',
        getActions: expect.any(Function),
        flex: 0,
      });
    });

    describe('getActions', () => {
      it('returns array with edit action', async () => {
        const { result } = renderHook(() =>
          useResourceDataGridProps(mockResources)
        );

        const mockGridRowParams = {
          id: 1,
          row: mockResources[0],
        };
        // @ts-ignore getActions should be defined
        const actions = result.current.columns[3].getActions(mockGridRowParams);
        expect(actions).toHaveLength(1);

        const renderResult = render(
          <div>
            {actions.map((action: ReactNode, i: number) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={i}>{action}</div>
            ))}
          </div>
        );

        const editButton = renderResult.getByText('Edit');
        await userEvent.click(editButton);
        expect(mockDispatch).toHaveBeenCalledWith(
          pushResource({ type: 'edit', resource: mockGridRowParams.row })
        );
      });
    });
  });

  describe('getRowId', () => {
    it('returns _id field from resource', () => {
      const { result } = renderHook(() =>
        useResourceDataGridProps(mockResources)
      );
      expect(result.current.getRowId({ _id: 'id' } as Resource)).toEqual('id');
    });
  });
});
