import { ActionType, ComponentType } from '@app/types';
import { renderHook } from '@testing-library/react';
import { createCompletionContext } from '@tests/utils/codemirror';
import { ToolEvalDataValuesMap } from '../useToolEvalDataMaps';
import {
  BOOST_CONFIG,
  useCodeMirrorJavascriptAutocomplete,
} from '../useCodeMirrorJavascriptAutocomplete';

const mockComponents = [
  { name: 'textInput1', type: ComponentType.TextInput },
  { name: 'table1', type: ComponentType.Table },
];

const mockActions = [
  { name: 'action1', type: ActionType.Javascript },
  { name: 'action2', type: ActionType.SmartContractRead },
];

const mockEvalArgs: ToolEvalDataValuesMap = {
  textInput1: {
    defaultValue: 'hello',
  },
  table1: {
    data: [{ email: 'andrew@gmail.com' }],
    columnHeaderNames: {
      email: 'New Email',
    },
  },
};

jest.mock('../useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: {
      components: mockComponents,
      actions: mockActions,
    },
  })),
}));

jest.mock('../useEvalArgs', () => ({
  useEvalArgs: jest.fn(() => mockEvalArgs),
}));

const mockRootOptions = [
  {
    label: 'ethers',
    detail: 'object',
    boost: BOOST_CONFIG.global,
  },
  {
    label: '_',
    detail: 'function',
    boost: BOOST_CONFIG.global,
  },
  {
    label: 'moment',
    detail: 'function',
    boost: BOOST_CONFIG.global,
  },
  {
    label: 'Web3',
    detail: 'undefined',
    boost: BOOST_CONFIG.global,
  },
  {
    label: 'textInput1',
    detail: 'component',
    boost: BOOST_CONFIG.element,
  },
  {
    label: 'table1',
    detail: 'component',
    boost: BOOST_CONFIG.element,
  },
  {
    label: 'action1',
    detail: 'action',
    boost: BOOST_CONFIG.element,
  },
  {
    label: 'action2',
    detail: 'action',
    boost: BOOST_CONFIG.element,
  },
];

describe('useCodeMirrorJavascriptAutocomplete', () => {
  describe('dynamic', () => {
    describe('empty options', () => {
      it('returns empty options if cursor is after invalid floating period', () => {
        const { result } = renderHook(() =>
          useCodeMirrorJavascriptAutocomplete(true)
        );

        const completionContext = createCompletionContext('{{ a . }}', 6, true);
        expect(result.current(completionContext)).toEqual({
          from: 6,
          options: [],
        });
      });

      it('returns empty options if beginning new expression', () => {
        const { result } = renderHook(() =>
          useCodeMirrorJavascriptAutocomplete(true)
        );

        const completionContext = createCompletionContext(
          '{{ textInput1|| }}',
          15,
          true
        );
        expect(result.current(completionContext)).toMatchObject({
          from: 15,
          options: [],
        });
      });
    });

    describe('root options', () => {
      it('returns root options if expression is empty', () => {
        const { result } = renderHook(() =>
          useCodeMirrorJavascriptAutocomplete(true)
        );

        const completionContext = createCompletionContext('{{}}', 2, true);
        expect(result.current(completionContext)).toMatchObject({
          from: 2,
          options: mockRootOptions,
        });
      });

      it('returns root options if cursor follows completed expression', () => {
        const { result } = renderHook(() =>
          useCodeMirrorJavascriptAutocomplete(true)
        );

        const completionContext = createCompletionContext(
          '{{ table1.data[0]b }}',
          18,
          true
        );
        expect(result.current(completionContext)).toMatchObject({
          from: 17,
          options: mockRootOptions,
        });
      });

      it('returns root options if there are no periods in discovered token', () => {
        const { result } = renderHook(() =>
          useCodeMirrorJavascriptAutocomplete(true)
        );

        const completionContext = createCompletionContext(
          '{{ textInput1 }}',
          13,
          true
        );
        expect(result.current(completionContext)).toMatchObject({
          from: 3,
          options: mockRootOptions,
        });
      });
    });

    describe('context-dependent', () => {
      it('returns root-level snippets', () => {
        const { result } = renderHook(() =>
          useCodeMirrorJavascriptAutocomplete(true)
        );

        const completionContext = createCompletionContext(
          '{{ textInput1. }}',
          14,
          true
        );
        expect(result.current(completionContext)).toMatchObject({
          from: 13,
          options: [
            {
              label: '.defaultValue',
              detail: 'string',
              boost: BOOST_CONFIG.field,
            },
          ],
        });
      });

      it('returns recursive snippets', () => {
        const { result } = renderHook(() =>
          useCodeMirrorJavascriptAutocomplete(true)
        );

        const completionContext = createCompletionContext(
          '{{ table1. }}',
          10,
          true
        );
        expect(result.current(completionContext)).toMatchObject({
          from: 9,
          options: [
            {
              label: '.data',
              detail: 'array',
              boost: BOOST_CONFIG.field,
            },
            {
              label: '.columnHeaderNames',
              detail: 'object',
              boost: BOOST_CONFIG.field,
            },
            {
              label: '.columnHeaderNames.email',
              detail: 'string',
              boost: BOOST_CONFIG.field,
            },
          ],
        });
      });

      it('returns current level snippets based on existing component token', () => {
        const { result } = renderHook(() =>
          useCodeMirrorJavascriptAutocomplete(true)
        );

        const completionContext = createCompletionContext(
          '{{ table1.data[0].em }}',
          20,
          true
        );
        expect(result.current(completionContext)).toMatchObject({
          from: 17,
          options: [
            {
              label: '.email',
              detail: 'string',
              boost: BOOST_CONFIG.field,
            },
          ],
        });
      });
    });
  });

  describe('javascript', () => {
    it('returns empty options if expression is empty', () => {
      const { result } = renderHook(() =>
        useCodeMirrorJavascriptAutocomplete(false)
      );

      const completionContext = createCompletionContext('', 0, false);
      expect(result.current(completionContext)).toMatchObject({
        from: 0,
        options: [],
      });
    });
  });
});
