import { Resource } from '@app/types';
import { render, renderHook, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import {
  formatCreatedAt,
  formatResourceType,
  renderNameCell,
} from '../../utils/dataGridFormatters';
import { useDataGridProps } from '../useDataGridProps';

const mockHandleEditClick = jest.fn();
const mockResources: Resource[] = [
  {
    id: '1',
    type: 'smart_contract',
    name: 'Test Contract',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    numLinkedQueries: 1,
    metadata: {
      smartContract: {
        chainId: 1,
        address: '0x123',
        abi: '[]',
        isProxy: false,
      },
    },
  },
];

describe('useDataGridProps', () => {
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

    it('returns number of linked queries as 4th column', () => {
      const { result } = renderHook(() =>
        useDataGridProps({
          resources: mockResources,
          onEditClick: mockHandleEditClick,
        })
      );
      expect(result.current.columns[3]).toEqual({
        field: 'numLinkedQueries',
        headerName: 'Linked Queries',
        type: 'number',
        flex: 1,
      });
    });

    it('returns actions as 5th column', () => {
      const { result } = renderHook(() =>
        useDataGridProps({
          resources: mockResources,
          onEditClick: mockHandleEditClick,
        })
      );
      expect(result.current.columns[4]).toEqual({
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
            type: 'smart_contract',
          },
        };
        // @ts-ignore getActions should be defined
        const actions = result.current.columns[4].getActions(mockGridRowParams);
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
        userEvent.click(editButton);
        await waitFor(() => {
          expect(mockHandleEditClick).toHaveBeenCalledWith(
            mockGridRowParams.id.toString()
          );
        });
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
            type: 'dune',
          },
        };
        // @ts-ignore getActions should be defined
        const actions = result.current.columns[4].getActions(mockGridRowParams);
        expect(actions).toHaveLength(0);
      });
    });
  });
});
