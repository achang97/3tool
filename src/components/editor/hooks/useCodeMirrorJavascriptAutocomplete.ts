import { GLOBAL_LIBRARIES } from '@app/constants';
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
import { useActiveTool } from './useActiveTool';
import { useEvalArgs } from './useEvalArgs';

export const BOOST_CONFIG = {
  global: 2,
  element: 3,
  field: 4,
  prototype: 1,
};

export const useCodeMirrorJavascriptAutocomplete = (
  isDynamic: boolean
): CompletionSource => {
  const evalArgs = useEvalArgs();
  const { tool } = useActiveTool();

  const rootOptions = useMemo(() => {
    const librarySnippets = GLOBAL_LIBRARIES.map(({ importName, library }) => {
      return createAutocompleteSnippet(importName, library, {
        boost: BOOST_CONFIG.global,
      });
    });

    const componentSnippets = tool.components.map((component) => {
      return createAutocompleteSnippet(component.name, component, {
        detail: 'component',
        boost: BOOST_CONFIG.element,
      });
    });

    const actionSnippets = tool.actions.map((action) => {
      return createAutocompleteSnippet(action.name, action, {
        detail: 'action',
        boost: BOOST_CONFIG.element,
      });
    });

    return [...librarySnippets, ...componentSnippets, ...actionSnippets];
  }, [tool.actions, tool.components]);

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
