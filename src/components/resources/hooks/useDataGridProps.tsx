import { Resource } from '@app/types/api';
import { Edit } from '@mui/icons-material';
import {
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
  GridRowsProp,
} from '@mui/x-data-grid';
import { useCallback, useMemo } from 'react';
import {
  formatResourceType,
  formatCreatedAt,
  renderNameCell,
} from '../utils/dataGridFormatters';

type HookArgs = {
  resources?: Resource[];
  onEditClick: (resourceId: string) => void;
};

type HookReturnType = {
  rows: GridRowsProp;
  columns: GridColDef[];
};

export const useDataGridProps = ({
  resources,
  onEditClick,
}: HookArgs): HookReturnType => {
  const rows: GridRowsProp = useMemo(() => {
    return resources ?? [];
  }, [resources]);

  const getRowActions = useCallback(
    (params: GridRowParams<Resource>) => {
      if (params.row.type !== 'smart_contract') {
        return [];
      }

      // TODO: Add delete action
      return [
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => onEditClick(params.id.toString())}
          showInMenu
        />,
      ];
    },
    [onEditClick]
  );

  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: 'type',
        headerName: 'Type',
        valueFormatter: formatResourceType,
        flex: 1,
      },
      {
        field: 'name',
        headerName: 'Resource',
        renderCell: renderNameCell,
        flex: 2,
      },
      {
        field: 'createdAt',
        headerName: 'Created At',
        type: 'dateTime',
        flex: 1,
        valueFormatter: formatCreatedAt,
      },
      {
        field: 'numLinkedQueries',
        headerName: 'Linked Queries',
        type: 'number',
        flex: 1,
      },
      {
        field: 'actions',
        type: 'actions',
        getActions: getRowActions,
        flex: 0,
      },
    ];
  }, [getRowActions]);

  return { rows, columns };
};
