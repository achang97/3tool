import { Resource, ResourceType } from '@app/types';
import { Box, Typography } from '@mui/material';
import {
  GridRenderCellParams,
  GridValueFormatterParams,
} from '@mui/x-data-grid';
import moment from 'moment';

export const formatResourceType = ({
  value,
}: GridValueFormatterParams<ResourceType>) => {
  switch (value) {
    case ResourceType.SmartContract:
      return 'Smart contract';
    case ResourceType.Dune:
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
}: GridRenderCellParams<string, Resource>) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
      <Box>{value}</Box>
      {row.type === ResourceType.SmartContract && (
        <Typography
          variant="caption"
          color="text.tertiary"
          sx={{ marginLeft: 0.5 }}
        >
          ({row.data.smartContract?.address})
        </Typography>
      )}
    </Box>
  );
};
