import { Resource, ResourceType } from '@app/types';
import { render, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockSmartContractResource } from '@tests/constants/data';
import { ReactNode } from 'react';
import {
  formatCreatedAt,
  formatResourceType,
  renderNameCell,
} from '../../utils/dataGridFormatters';
import { useDataGridProps } from '../useDataGridProps';

const mockHandleEditClick = jest.fn();
const mockResources: Resource[] = [mockSmartContractResource];

describe('useDataGridProps', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rows', () => {
    it('returns empty array if resources is undefined', () => {
      const { result } = renderHook(() =>
        useDataGridProps({
          resources: undefined,
          onEditClick: mockHandleEditClick,
        })
      );
      expect(result.current.rows).toEqual([]);
    });

    it('returns resources array', () => {
      const { result } = renderHook(() =>
        useDataGridProps({
          resources: mockResources,
          onEditClick: mockHandleEditClick,
        })
      );
      expect(result.current.rows).toEqual(mockResources);
    });
  });

  describe('columns', () => {
    it('returns type as 1st column', () => {
      const { result } = renderHook(() =>
        useDataGridProps({
          resources: mockResources,
          onEditClick: mockHandleEditClick,
        })
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
        useDataGridProps({
          resources: mockResources,
          onEditClick: mockHandleEditClick,
        })
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
        useDataGridProps({
          resources: mockResources,
          onEditClick: mockHandleEditClick,
        })
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
        useDataGridProps({
          resources: mockResources,
          onEditClick: mockHandleEditClick,
        })
      );
      expect(result.current.columns[3]).toEqual({
        field: 'actions',
        type: 'actions',
        getActions: expect.any(Function),
        flex: 0,
      });
    });

    describe('getActions', () => {
      it('returns array with edit action if type is smart_contract', async () => {
        const { result } = renderHook(() =>
          useDataGridProps({
            resources: mockResources,
            onEditClick: mockHandleEditClick,
          })
        );

        const mockGridRowParams = {
          id: 1,
          row: {
            type: ResourceType.SmartContract,
          },
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
        expect(mockHandleEditClick).toHaveBeenCalledWith(mockGridRowParams.row);
      });

      it('returns empty array if type is not smart_contract', () => {
        const { result } = renderHook(() =>
          useDataGridProps({
            resources: mockResources,
            onEditClick: mockHandleEditClick,
          })
        );

        const mockGridRowParams = {
          id: 1,
          row: {
            type: ResourceType.Dune,
          },
        };
        // @ts-ignore getActions should be defined
        const actions = result.current.columns[3].getActions(mockGridRowParams);
        expect(actions).toHaveLength(0);
      });
    });
  });
});
