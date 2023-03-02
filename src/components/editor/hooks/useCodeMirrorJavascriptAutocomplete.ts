import {
  CompletionContext,
  CompletionResult,
  CompletionSource,
} from '@codemirror/autocomplete';
import _ from 'lodash';
import { useCallback, useMemo } from 'react';
import {
  createAutocompleteSnippets,
  parseTokenFromContext,
  createAutocompleteSnippet,
} from '../utils/codemirror';
import { useEvalArgs } from './useEvalArgs';
import { useToolElementNames } from './useToolElementNames';

export const BOOST_CONFIG = {
  global: 2,
  element: 3,
  field: 4,
  prototype: 1,
};

export const useCodeMirrorJavascriptAutocomplete = (
  isDynamic: boolean
): CompletionSource => {
  const { dynamicEvalArgs, staticEvalArgs } = useEvalArgs();
  const { actionNames, componentNames } = useToolElementNames();

  const evalArgs = useMemo(() => {
    return isDynamic ? dynamicEvalArgs : staticEvalArgs;
  }, [dynamicEvalArgs, isDynamic, staticEvalArgs]);

  const rootOptions = useMemo(() => {
    return Object.entries(evalArgs).map(([name, value]) => {
      let boost: number = BOOST_CONFIG.global;
      let detail: string | undefined;

      if (actionNames.includes(name)) {
        boost = BOOST_CONFIG.element;
        detail = 'action';
      } else if (componentNames.includes(name)) {
        boost = BOOST_CONFIG.element;
        detail = 'component';
      }

      return createAutocompleteSnippet(name, value, {
        boost,
        detail,
      });
    });
  }, [actionNames, componentNames, evalArgs]);

  const getAutocompleteOptions = useCallback(
    (context: CompletionContext): CompletionResult => {
      // Empty expression start: {{
      if (isDynamic && context.matchBefore(/{{\s*/)) {
        return { from: context.pos, options: rootOptions };
      }

      const currToken = parseTokenFromContext(context);

      if (!currToken) {
        return { from: context.pos, options: [] };
      }
      if (currToken.isRoot) {
        return { from: currToken.from, options: rootOptions };
      }

      const currValue = _.get(evalArgs, currToken.token);
      return {
        from: currToken.from,
        options: createAutocompleteSnippets(currValue, {
          boost: BOOST_CONFIG.field,
        }),
      };
    },
    [isDynamic, evalArgs, rootOptions]
  );

  return getAutocompleteOptions;
};
