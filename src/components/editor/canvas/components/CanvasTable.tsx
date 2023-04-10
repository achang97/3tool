import { BaseCanvasComponentProps, ComponentType } from '@app/types';
import { useCallback, useMemo } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridSelectionModel } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import _ from 'lodash';
import { useAppDispatch } from '@app/redux/hooks';
import { DataGridPlaceholder } from '@app/components/common/DataGridPlaceholder';
import { setComponentInput } from '@app/redux/features/activeToolSlice';
import { useComponentEvalData } from '../../hooks/useComponentEvalData';

type TableRowData = {
  data: unknown;
  id: number;
};

type CanvasTableProps = BaseCanvasComponentProps & {
  __test__disableVirtualization?: boolean;
};

export const CanvasTable = ({
  name,
  __test__disableVirtualization = process.env.NODE_ENV === 'test',
}: CanvasTableProps) => {
  const dispatch = useAppDispatch();
  const { evalDataValues } = useComponentEvalData<ComponentType.Table>(name);

  const rows: GridRowsProp<TableRowData> = useMemo(() => {
    if (!evalDataValues.data) {
      return [];
    }

    return evalDataValues.data.map((dataElem, i) => ({
      data: dataElem,
      id: i,
    }));
  }, [evalDataValues.data]);

  const columns: GridColDef<TableRowData>[] = useMemo(() => {
    const colNames = new Set<string>();

    rows.forEach((row) => {
      if (!row.data) {
        return;
      }

      Object.keys(row.data).forEach((key) => {
        colNames.add(key);
      });
    });

    return [...colNames].map((colName) => ({
      field: colName,
      flex: 1,
      valueGetter: ({ row }) => _.get(row.data, colName),
    }));
  }, [rows]);

  const handleRowSelectionChange = useCallback(
    (selectedIds: GridSelectionModel) => {
      const selectedRows = rows.filter((_row, i) => selectedIds.includes(i)).map((row) => row.data);

      dispatch(setComponentInput({ name, input: { selectedRows } }));
    },
    [dispatch, name, rows]
  );

  const NoRowsOverlay = useCallback(() => {
    return <DataGridPlaceholder>{evalDataValues.emptyMessage}</DataGridPlaceholder>;
  }, [evalDataValues.emptyMessage]);

  return (
    <Box data-testid="canvas-table">
      <DataGrid
        autoPageSize={!__test__disableVirtualization}
        disableVirtualization={__test__disableVirtualization}
        columns={columns}
        rows={rows}
        checkboxSelection={evalDataValues.multiselect}
        onSelectionModelChange={handleRowSelectionChange}
        components={{
          NoRowsOverlay,
        }}
      />
    </Box>
  );
};
