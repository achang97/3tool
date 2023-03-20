import {
  Action,
  ActionEvent,
  ActionType,
  Component,
  ComponentEvent,
  ComponentType,
  EventHandlerType,
} from '@app/types';
import { renderHook } from '@testing-library/react';
import { useElementFlattenFields } from '../useElementFlattenFields';

describe('useElementFlattenFields', () => {
  describe('onlyLeaves', () => {
    it('only returns leaves if onlyLeaves is true', () => {
      const mockElement = {
        name: 'action1',
        type: ActionType.Javascript,
        data: {
          javascript: {
            code: 'code',
          },
        },
        eventHandlers: [],
      } as unknown as Action;

      const { result } = renderHook(() =>
        useElementFlattenFields({
          includePrefix: false,
          onlyLeaves: true,
        })
      );
      expect(result.current(mockElement)).toEqual({
        name: 'action1',
        fields: [
          expect.objectContaining({
            name: 'code',
            value: 'code',
            isLeaf: true,
          }),
        ],
      });
    });

    it('returns non-leaves if onlyLeaves is false', () => {
      const mockElement = {
        name: 'action1',
        type: ActionType.Javascript,
        data: {
          javascript: {
            code: 'code',
          },
        },
        eventHandlers: [],
      } as unknown as Action;

      const { result } = renderHook(() =>
        useElementFlattenFields({
          includePrefix: false,
          onlyLeaves: false,
        })
      );
      expect(result.current(mockElement)).toEqual({
        name: 'action1',
        fields: [
          expect.objectContaining({
            name: 'code',
            value: 'code',
            isLeaf: true,
          }),
          expect.objectContaining({
            name: 'eventHandlers',
            value: '',
            isLeaf: false,
          }),
        ],
      });
    });
  });

  describe('prefix', () => {
    it('includes element name as prefix and parent if includePrefix is true', () => {
      const mockElement = {
        name: 'action1',
        type: ActionType.Javascript,
        data: {
          javascript: {
            code: 'code',
          },
        },
        eventHandlers: [],
      } as unknown as Action;

      const { result } = renderHook(() =>
        useElementFlattenFields({
          includePrefix: true,
          onlyLeaves: true,
        })
      );
      expect(result.current(mockElement)).toEqual({
        name: 'action1',
        fields: [
          expect.objectContaining({
            name: 'action1.code',
            parent: 'action1',
          }),
        ],
      });
    });

    it('does not include element name as prefix and parent if includePrefix is false', () => {
      const mockElement = {
        name: 'action1',
        type: ActionType.Javascript,
        data: {
          javascript: {
            code: 'code',
          },
        },
        eventHandlers: [],
      } as unknown as Action;

      const { result } = renderHook(() =>
        useElementFlattenFields({
          includePrefix: false,
          onlyLeaves: true,
        })
      );
      expect(result.current(mockElement)).toEqual({
        name: 'action1',
        fields: [
          expect.objectContaining({
            name: 'code',
            parent: '',
          }),
        ],
      });
    });
  });

  describe('extensions', () => {
    it('adds "any" eval type to object if lookup returns invalid value', () => {
      const mockElement = {
        name: 'action1',
        type: ActionType.Javascript,
        data: {},
        eventHandlers: [],
      } as unknown as Action;

      const { result } = renderHook(() =>
        useElementFlattenFields({
          includePrefix: false,
          onlyLeaves: false,
        })
      );
      expect(result.current(mockElement)).toEqual({
        name: 'action1',
        fields: [
          expect.objectContaining({
            name: 'eventHandlers',
            evalType: 'any',
          }),
        ],
      });
    });

    it('adds default isJavascript flag as false to object', () => {
      const mockElement = {
        name: 'action1',
        type: ActionType.Javascript,
        data: {},
        eventHandlers: [],
      } as unknown as Action;

      const { result } = renderHook(() =>
        useElementFlattenFields({
          includePrefix: false,
          onlyLeaves: false,
        })
      );
      expect(result.current(mockElement)).toEqual({
        name: 'action1',
        fields: [
          expect.objectContaining({
            name: 'eventHandlers',
            isJavascript: false,
          }),
        ],
      });
    });
  });

  describe('actions', () => {
    it('returns fields from data', () => {
      const mockAction = {
        name: 'action1',
        type: ActionType.Javascript,
        data: {
          javascript: {
            code: 'code',
          },
        },
        eventHandlers: [],
      } as unknown as Action;

      const { result } = renderHook(() =>
        useElementFlattenFields({
          includePrefix: false,
          onlyLeaves: true,
        })
      );
      expect(result.current(mockAction)).toEqual({
        name: 'action1',
        fields: [
          {
            name: 'code',
            value: 'code',
            parent: '',
            isLeaf: true,
            evalType: 'string',
            isJavascript: true,
          },
        ],
      });
    });

    it('returns fields from event handlers', () => {
      const mockAction = {
        name: 'action1',
        type: ActionType.Javascript,
        data: {},
        eventHandlers: [
          {
            event: ActionEvent.Success,
            type: EventHandlerType.Action,
            data: {
              action: {
                actionName: 'id',
              },
            },
          },
        ],
      } as unknown as Action;

      const { result } = renderHook(() =>
        useElementFlattenFields({
          includePrefix: false,
          onlyLeaves: true,
        })
      );
      expect(result.current(mockAction)).toEqual({
        name: 'action1',
        fields: [
          {
            name: 'eventHandlers[0].event',
            value: 'success',
            parent: 'eventHandlers[0]',
            isLeaf: true,
            evalType: 'any',
            isJavascript: false,
          },
          {
            name: 'eventHandlers[0].type',
            value: 'action',
            parent: 'eventHandlers[0]',
            isLeaf: true,
            evalType: 'any',
            isJavascript: false,
          },
          {
            name: 'eventHandlers[0].actionName',
            value: 'id',
            parent: 'eventHandlers[0]',
            isLeaf: true,
            evalType: 'string',
            isJavascript: false,
          },
        ],
      });
    });
  });

  describe('components', () => {
    it('returns fields from data', () => {
      const mockComponent = {
        name: 'button1',
        type: ComponentType.Button,
        data: {
          button: {
            text: 'text',
          },
        },
        eventHandlers: [],
      } as unknown as Component;

      const { result } = renderHook(() =>
        useElementFlattenFields({
          includePrefix: false,
          onlyLeaves: true,
        })
      );
      expect(result.current(mockComponent)).toEqual({
        name: 'button1',
        fields: [
          {
            name: 'text',
            value: 'text',
            parent: '',
            isLeaf: true,
            evalType: 'string',
            isJavascript: false,
          },
        ],
      });
    });

    it('returns fields from event handlers', () => {
      const mockComponent = {
        name: 'button1',
        type: ComponentType.Button,
        data: {},
        eventHandlers: [
          {
            event: ComponentEvent.Click,
            type: EventHandlerType.Action,
            data: {
              action: {
                actionName: 'id',
              },
            },
          },
        ],
      } as unknown as Component;

      const { result } = renderHook(() =>
        useElementFlattenFields({
          includePrefix: false,
          onlyLeaves: true,
        })
      );
      expect(result.current(mockComponent)).toEqual({
        name: 'button1',
        fields: [
          {
            name: 'eventHandlers[0].event',
            value: 'click',
            parent: 'eventHandlers[0]',
            isLeaf: true,
            evalType: 'any',
            isJavascript: false,
          },
          {
            name: 'eventHandlers[0].type',
            value: 'action',
            parent: 'eventHandlers[0]',
            isLeaf: true,
            evalType: 'any',
            isJavascript: false,
          },
          {
            name: 'eventHandlers[0].actionName',
            value: 'id',
            parent: 'eventHandlers[0]',
            isLeaf: true,
            evalType: 'string',
            isJavascript: false,
          },
        ],
      });
    });
  });
});
