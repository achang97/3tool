import { Resource } from '@app/types';
import { Edit } from '@mui/icons-material';
import {
  GridActionsCellItem,
  GridColDef,
  GridRowIdGetter,
  GridRowParams,
  GridRowsProp,
} from '@mui/x-data-grid';
import { useCallback, useMemo } from 'react';
import { pushResource } from '@app/redux/features/resourcesSlice';
import { useAppDispatch } from '@app/redux/hooks';
import { formatResourceType, formatCreatedAt, renderNameCell } from '../utils/dataGridFormatters';

type DataGridProps = {
  rows: GridRowsProp<Resource>;
  columns: GridColDef<Resource>[];
  getRowId: GridRowIdGetter<Resource>;
};

export const useResourceDataGridProps = (resources?: Resource[]): DataGridProps => {
  const dispatch = useAppDispatch();

  const rows: GridRowsProp<Resource> = useMemo(() => {
    return resources ?? [];
  }, [resources]);

  const handleEditDialogOpen = useCallback(
    (resource: Resource) => {
      dispatch(pushResource({ type: 'edit', resource }));
    },
    [dispatch]
  );

  const getRowActions = useCallback(
    (params: GridRowParams<Resource>) => {
      // TODO: Add delete action
      return [
        <GridActionsCellItem
          key="edit"
          icon={<Edit />}
          label="Edit"
          onClick={() => handleEditDialogOpen(params.row)}
          showInMenu
        />,
      ];
    },
    [handleEditDialogOpen]
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
        field: 'actions',
        type: 'actions',
        getActions: getRowActions,
        flex: 0,
      },
    ];
  }, [getRowActions]);

  const getRowId: GridRowIdGetter<Resource> = useCallback((resource: Resource) => {
    return resource._id;
  }, []);

  return { rows, columns, getRowId };
};
