import { useCallback, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useGetResourcesQuery } from '@app/redux/services/resources';
import { InputAdornment, TextField, Box } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useDebouncedQuery } from '@app/hooks/useDebouncedQuery';
import { EditResourceDialog } from './EditResourceDialog';
import { useDataGridProps } from './hooks/useDataGridProps';

type ResourceDataGridProps = {
  __test__disableVirtualization?: boolean;
};

export const ResourceDataGrid = ({
  __test__disableVirtualization,
}: ResourceDataGridProps) => {
  const { query, debouncedQuery, handleQueryChange } = useDebouncedQuery();
  const { data: resources } = useGetResourcesQuery(debouncedQuery);

  const [activeResourceId, setActiveResourceId] = useState<string>();

  const handleEditDialogOpen = useCallback((resourceId: string) => {
    setActiveResourceId(resourceId);
  }, []);

  const handleEditDialogClose = useCallback(() => {
    setActiveResourceId(undefined);
  }, []);

  const { rows, columns } = useDataGridProps({
    resources,
    onEditClick: handleEditDialogOpen,
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <TextField
        placeholder="Search resources"
        fullWidth
        size="small"
        sx={{ marginBottom: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        // eslint-disable-next-line react/jsx-no-duplicate-props
        inputProps={{
          'data-testid': 'resource-data-grid-search-input',
        }}
        value={query}
        onChange={handleQueryChange}
      />
      <DataGrid
        rows={rows}
        columns={columns}
        disableColumnMenu
        disableSelectionOnClick
        disableVirtualization={__test__disableVirtualization}
      />
      <EditResourceDialog
        open={!!activeResourceId}
        resourceId={activeResourceId}
        onClose={handleEditDialogClose}
      />
    </Box>
  );
};
