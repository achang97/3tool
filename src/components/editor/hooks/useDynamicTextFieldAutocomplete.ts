import { GLOBAL_LIBRARIES } from '@app/constants';
import { useAppSelector } from '@app/redux/hooks';
import {
  Completion,
  CompletionContext,
  CompletionResult,
  CompletionSource,
  snippetCompletion,
} from '@codemirror/autocomplete';
import _ from 'lodash';
import { useCallback, useMemo } from 'react';
import {
  readAsModule,
  generateSnippets,
  getTokenFromContext,
  getSnippetTemplate,
} from '../utils/codeMirror';
import { useActiveTool } from './useActiveTool';

const GLOBAL_LIBRARY_MAP = _.chain(GLOBAL_LIBRARIES)
  .keyBy('importName')
  .mapValues(({ library, isModule }) => {
    return isModule ? readAsModule(library) : library;
  })
  .value();

export const useDynamicTextFieldAutocomplete = (): CompletionSource => {
  const { componentEvalDataValuesMap } = useActiveTool();
  const { componentInputs } = useAppSelector((state) => state.activeTool);

  const lookupMap = useMemo(
    () =>
      _.merge(
        {},
        GLOBAL_LIBRARY_MAP,
        componentEvalDataValuesMap,
        componentInputs
      ),
    [componentEvalDataValuesMap, componentInputs]
  );

  const rootOptions = useMemo(() => {
    const options: Completion[] = [];

    GLOBAL_LIBRARIES.forEach(({ importName, library }) => {
      const librarySnippet = snippetCompletion(getSnippetTemplate(importName), {
        label: importName,
        detail: typeof library,
        boost: 1,
      });
      options.push(librarySnippet);
    });

    Object.entries(componentEvalDataValuesMap).forEach(([componentName]) => {
      const componentSnippet = snippetCompletion(
        getSnippetTemplate(componentName),
        {
          label: componentName,
          detail: 'component',
          boost: 2,
        }
      );
      options.push(componentSnippet);
    });

    return options;
  }, [componentEvalDataValuesMap]);

  const getAutocompleteOptions = useCallback(
    (context: CompletionContext): CompletionResult => {
      const currToken = getTokenFromContext(context);

      if (!currToken) {
        return { from: context.pos, options: [] };
      }

      if (currToken.isRoot) {
        return { from: currToken.from, options: rootOptions };
      }

      const currValue = _.get(lookupMap, currToken.token);
      return {
        from: currToken.from,
        options: generateSnippets(currValue),
      };
    },
    [rootOptions, lookupMap]
  );

  return getAutocompleteOptions;
};
