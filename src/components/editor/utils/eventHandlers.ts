import { EVENT_HANDLER_EVENT_CONFIGS } from '@app/constants';
import { ActionEvent, ComponentEvent, EventHandler, EventHandlerType } from '@app/types';
import { GridRenderCellParams, GridValueFormatterParams } from '@mui/x-data-grid';

export type EventHandlerData = EventHandler & {
  id: number;
};

export const formatEventHandlerEvent = ({
  value,
}: GridValueFormatterParams<ActionEvent | ComponentEvent>) => {
  return EVENT_HANDLER_EVENT_CONFIGS[value].label;
};

export const renderEventHandlerType = ({
  value,
  row,
}: GridRenderCellParams<EventHandlerType, EventHandlerData>) => {
  switch (value) {
    case EventHandlerType.Action: {
      const { actionName, method } = row.data.action ?? {};
      if (actionName && method) {
        return `${actionName}.${method}()`;
      }
      break;
    }
    case EventHandlerType.Url:
      return 'utils.openUrl()';
    default:
      break;
  }

  return 'Incomplete section';
};
