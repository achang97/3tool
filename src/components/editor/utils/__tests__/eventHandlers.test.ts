import { EVENT_HANDLER_EVENT_CONFIGS } from '@app/constants';
import { ComponentEvent, EventHandlerType } from '@app/types';
import { GridRenderCellParams, GridValueFormatterParams } from '@mui/x-data-grid';
import {
  EventHandlerData,
  formatEventHandlerEvent,
  renderEventHandlerType,
} from '../eventHandlers';

describe('eventHandlers', () => {
  describe('formatEventHandlerEvent', () => {
    it('returns label for type', () => {
      const mockEvent = ComponentEvent.Click;
      const result = formatEventHandlerEvent({
        value: mockEvent,
      } as GridValueFormatterParams<ComponentEvent>);
      expect(result).toEqual(EVENT_HANDLER_EVENT_CONFIGS[mockEvent].label);
    });
  });

  describe('renderEventHandlerType', () => {
    describe('action', () => {
      it('returns action name and method', () => {
        const mockEventHandler = {
          type: EventHandlerType.Action,
          data: {
            action: {
              actionName: 'action1',
              method: 'method',
            },
          },
        };
        const result = renderEventHandlerType({
          value: mockEventHandler.type,
          row: mockEventHandler,
        } as GridRenderCellParams<EventHandlerType, EventHandlerData>);
        expect(result).toEqual('action1.method()');
      });

      it('returns "Incomplete section" if action name is not defined', () => {
        const mockEventHandler = {
          type: EventHandlerType.Action,
          data: {
            action: {
              actionName: '',
              method: 'method',
            },
          },
        };
        const result = renderEventHandlerType({
          value: mockEventHandler.type,
          row: mockEventHandler,
        } as GridRenderCellParams<EventHandlerType, EventHandlerData>);
        expect(result).toEqual('Incomplete section');
      });

      it('returns "Incomplete section" if action method is not defined', () => {
        const mockEventHandler = {
          type: EventHandlerType.Action,
          data: {
            action: {
              actionName: 'action1',
              method: '',
            },
          },
        };
        const result = renderEventHandlerType({
          value: mockEventHandler.type,
          row: mockEventHandler,
        } as GridRenderCellParams<EventHandlerType, EventHandlerData>);
        expect(result).toEqual('Incomplete section');
      });
    });

    describe('url', () => {
      it('returns "utils.openUrl()"', () => {
        const mockEventHandler = {
          type: EventHandlerType.Url,
          data: {},
        };
        const result = renderEventHandlerType({
          value: mockEventHandler.type,
          row: mockEventHandler,
        } as GridRenderCellParams<EventHandlerType, EventHandlerData>);
        expect(result).toEqual('utils.openUrl()');
      });
    });
  });
});
