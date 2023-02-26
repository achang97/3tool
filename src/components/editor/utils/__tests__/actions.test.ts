import { Action, ActionType } from '@app/types';
import { executeAction } from '../actions';

describe('actions', () => {
  describe('javascript', () => {
    it('executes javascript action with args', () => {
      const result = executeAction(
        {
          type: ActionType.Javascript,
          data: {
            javascript: { code: 'return button1.text', transformer: '' },
          },
        } as Action,
        { button1: { text: 'hello' } }
      );
      expect(result.data).toEqual('hello');
    });
  });

  describe('transformer', () => {
    it('transforms data from first execution step', () => {
      const result = executeAction(
        {
          type: ActionType.Javascript,
          data: {
            javascript: {
              code: 'return button1.text',
              // eslint-disable-next-line no-template-curly-in-string
              transformer: 'return `${data} world!`',
            },
          },
        } as Action,
        { button1: { text: 'hello' } }
      );
      expect(result.data).toEqual('hello world!');
    });
  });

  describe('error', () => {
    it('returns error message', () => {
      const result = executeAction(
        {
          type: ActionType.Javascript,
          data: { javascript: { code: 'asdf', transformer: '' } },
        } as Action,
        {}
      );
      expect(result).toEqual({
        data: undefined,
        error: 'asdf is not defined',
      });
    });
  });
});
