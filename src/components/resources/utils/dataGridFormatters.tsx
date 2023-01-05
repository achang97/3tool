import { Resource } from '@app/types/api';
import { Box, Typography } from '@mui/material';
import {
  GridRenderCellParams,
  GridValueFormatterParams,
} from '@mui/x-data-grid';
import moment from 'moment';

export const formatResourceType = ({
  value,
}: GridValueFormatterParams<Resource['type']>) => {
  switch (value) {
    case 'smart_contract':
      return 'Smart contract';
    case 'dune':
      return 'Dune';
    default:
      return '';
  }
};

export const formatCreatedAt = ({ value }: GridValueFormatterParams<Date>) => {
  return moment(value).format('lll');
};

export const renderNameCell = ({
  value,
  row,
}: GridRenderCellParams<string>) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
      <Typography>{value}</Typography>
      {row.type === 'smart_contract' && (
        <Typography
          variant="caption"
          color="text.tertiary"
          sx={{ marginLeft: 0.5 }}
        >
          ({row.metadata.smartContract?.address})
        </Typography>
      )}
    </Box>
  );
};
