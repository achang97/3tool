import { renderHook } from '@testing-library/react';
import { createCompletionContext } from '@tests/utils/codeMirror';
import { ComponentEvalDataValuesMap } from '../useComponentEvalDataMaps';
import { useDynamicTextFieldAutocomplete } from '../useDynamicTextFieldAutocomplete';

const mockComponentEvalDataValuesMap: ComponentEvalDataValuesMap = {
  button1: {
    text: 'hello',
  },
  table1: {
    data: [{ email: 'andrew@gmail.com' }],
    columnHeaderNames: {
      email: 'New Email',
    },
  },
};

const mockComponentInputs = {
  table1: {
    selectedRows: [{ test: 1 }],
  },
};

const mockRootOptions = [
  {
    label: 'ethers',
    detail: 'object',
    boost: 1,
  },
  {
    label: '_',
    detail: 'function',
    boost: 1,
  },
  {
    label: 'moment',
    detail: 'function',
    boost: 1,
  },
  {
    label: 'Web3',
    detail: 'undefined',
    boost: 1,
  },
  {
    label: 'button1',
    detail: 'component',
    boost: 2,
  },
  {
    label: 'table1',
    detail: 'component',
    boost: 2,
  },
];

jest.mock('ethers', () => ({
  ethers: {
    functionOne: () => {},
    functionTwo: () => {},
  },
}));

jest.mock('@app/redux/hooks', () => ({
  useAppSelector: jest.fn(() => ({
    componentInputs: mockComponentInputs,
  })),
}));

jest.mock('../useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    componentEvalDataValuesMap: mockComponentEvalDataValuesMap,
  })),
}));

describe('useDynamicTextFieldAutocomplete', () => {
  describe('dynamic', () => {
    it('returns empty options if cursor is after invalid floating period', () => {
      const { result } = renderHook(() => useDynamicTextFieldAutocomplete());

      const completionContext = createCompletionContext('{{ a . }}', 6);
      expect(result.current(completionContext)).toEqual({
        from: 6,
        options: [],
      });
    });

    it('returns empty options if cursor follows completed expression', () => {
      const { result } = renderHook(() => useDynamicTextFieldAutocomplete());

      const completionContext = createCompletionContext(
        '{{ table1.data[0]b }}',
        18
      );
      expect(result.current(completionContext)).toEqual({
        from: 18,
        options: [],
      });
    });

    it('returns empty options if cursor follows invalid JavaScript', () => {
      const { result } = renderHook(() => useDynamicTextFieldAutocomplete());

      const completionContext = createCompletionContext(
        '{{ table1.data[]b }}',
        17
      );
      expect(result.current(completionContext)).toEqual({
        from: 17,
        options: [],
      });
    });

    it('returns root options if expression is empty', () => {
      const { result } = renderHook(() => useDynamicTextFieldAutocomplete());

      const completionContext = createCompletionContext('{{}}', 2);
      expect(result.current(completionContext)).toMatchObject({
        from: 2,
        options: mockRootOptions,
      });
    });

    it('returns root options if beginning new expression', () => {
      const { result } = renderHook(() => useDynamicTextFieldAutocomplete());

      const completionContext = createCompletionContext('{{ button1|| }}', 12);
      expect(result.current(completionContext)).toMatchObject({
        from: 12,
        options: mockRootOptions,
      });
    });

    it('returns root options if there are no periods in discovered token', () => {
      const { result } = renderHook(() => useDynamicTextFieldAutocomplete());

      const completionContext = createCompletionContext('{{ button1 }}', 10);
      expect(result.current(completionContext)).toMatchObject({
        from: 3,
        options: mockRootOptions,
      });
    });

    it('returns global library snippets based on existing token', () => {
      const { result } = renderHook(() => useDynamicTextFieldAutocomplete());

      const completionContext = createCompletionContext('{{ ethers. }}', 10);
      expect(result.current(completionContext)).toMatchObject({
        from: 9,
        options: [
          {
            label: '.functionOne',
            detail: 'function',
          },
          {
            label: '.functionTwo',
            detail: 'function',
          },
        ],
      });
    });

    it('returns recursive snippets from both component data and input values', () => {
      const { result } = renderHook(() => useDynamicTextFieldAutocomplete());

      const completionContext = createCompletionContext('{{ table1. }}', 10);
      expect(result.current(completionContext)).toMatchObject({
        from: 9,
        options: [
          {
            label: '.data',
            detail: 'array',
          },
          {
            label: '.columnHeaderNames',
            detail: 'object',
          },
          {
            label: '.columnHeaderNames.email',
            detail: 'string',
          },
          {
            label: '.selectedRows',
            detail: 'array',
          },
        ],
      });
    });

    it('returns current level snippets based on existing component token', () => {
      const { result } = renderHook(() => useDynamicTextFieldAutocomplete());

      const completionContext = createCompletionContext(
        '{{ table1.data[0].em }}',
        20
      );
      expect(result.current(completionContext)).toMatchObject({
        from: 17,
        options: [
          {
            label: '.email',
            detail: 'string',
          },
        ],
      });
    });
  });

  describe('javascript', () => {
    it('returns root options if expression is empty', () => {
      const { result } = renderHook(() => useDynamicTextFieldAutocomplete());

      const completionContext = createCompletionContext('', 0, false);
      expect(result.current(completionContext)).toMatchObject({
        from: 0,
        options: mockRootOptions,
      });
    });

    it('returns root options from 0-index', () => {
      const { result } = renderHook(() => useDynamicTextFieldAutocomplete());

      const completionContext = createCompletionContext('button1', 7, false);
      expect(result.current(completionContext)).toMatchObject({
        from: 0,
        options: mockRootOptions,
      });
    });
  });
});
