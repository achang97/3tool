import { Resource, ResourceType } from '@app/types';
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
  onEditClick: (resource: Resource) => void;
};

type DataGridProps = {
  rows: GridRowsProp<Resource>;
  columns: GridColDef<Resource>[];
};

export const useDataGridProps = ({
  resources,
  onEditClick,
}: HookArgs): DataGridProps => {
  const rows: GridRowsProp<Resource> = useMemo(() => {
    return resources ?? [];
  }, [resources]);

  const getRowActions = useCallback(
    (params: GridRowParams<Resource>) => {
      if (params.row.type !== ResourceType.SmartContract) {
        return [];
      }

      // TODO: Add delete action
      return [
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => onEditClick(params.row)}
          showInMenu
        />,
      ];
    },
    [onEditClick]
  );

  const columns: GridColDef<Resource>[] = useMemo(() => {
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
