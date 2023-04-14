import { Help } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

type HelpTooltipProps = {
  text: string;
};

export const HelpTooltip = ({ text }: HelpTooltipProps) => {
  return (
    <Tooltip
      title={text}
      sx={{
        cursor: 'pointer',
        fontSize: '0.9rem',
        color: 'greyscale.icon.dark',
        mx: 0.5,
      }}
    >
      <Help data-testid="help-tooltip-icon" fontSize="inherit" />
    </Tooltip>
  );
};
