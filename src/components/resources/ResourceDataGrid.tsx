import { DataGrid } from '@mui/x-data-grid';
import { useGetResourcesQuery } from '@app/redux/services/resources';
import { InputAdornment, TextField, Box } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useDebouncedQuery } from '@app/hooks/useDebouncedQuery';
import { useResourceDataGridProps } from './hooks/useResourceDataGridProps';

type ResourceDataGridProps = {
  __test__disableVirtualization?: boolean;
};

export const ResourceDataGrid = ({
  __test__disableVirtualization = process.env.NODE_ENV === 'test',
}: ResourceDataGridProps) => {
  const { query, debouncedQuery, handleQueryChange } = useDebouncedQuery();
  const { data: resources } = useGetResourcesQuery(debouncedQuery, {
    refetchOnMountOrArgChange: true,
  });

  const { rows, columns } = useResourceDataGridProps(resources);

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}
      data-testid="resource-data-grid"
    >
      <TextField
        placeholder="Search resources"
        fullWidth
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
    </Box>
  );
};
