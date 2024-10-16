import { RESOURCE_CONFIGS } from '@app/constants';
import { Resource, ResourceType } from '@app/types';
import { Box, Stack, Typography } from '@mui/material';
import { GridRenderCellParams, GridValueFormatterParams } from '@mui/x-data-grid';
import moment from 'moment';

export const formatResourceType = ({ value }: GridValueFormatterParams<ResourceType>) => {
  return RESOURCE_CONFIGS[value].label;
};

export const formatCreatedAt = ({ value }: GridValueFormatterParams<Date>) => {
  return moment(value).format('lll');
};

export const renderNameCell = ({ value, row }: GridRenderCellParams<string, Resource>) => {
  return (
    <Stack direction="row" sx={{ alignItems: 'flex-end' }}>
      <Box>{value}</Box>
      {row.type === ResourceType.SmartContract && (
        <Typography variant="caption" color="text.tertiary" sx={{ marginLeft: 0.5 }}>
          ({row.data.smartContract?.address})
        </Typography>
      )}
    </Stack>
  );
};
