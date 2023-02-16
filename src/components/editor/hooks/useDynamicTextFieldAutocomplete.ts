import { COMPONENT_INPUT_TEMPLATES, GLOBAL_LIBRARIES } from '@app/constants';
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
  createAutocompleteSnippets,
  parseTokenFromContext,
  createAutocompleteSnippetTemplate,
} from '../utils/codemirror';
import { useActiveTool } from './useActiveTool';

const GLOBAL_LIBRARY_MAP = _.chain(GLOBAL_LIBRARIES)
  .keyBy('importName')
  .mapValues(({ library, isModule }) => {
    return isModule ? readAsModule(library) : library;
  })
  .value();

export const useDynamicTextFieldAutocomplete = (): CompletionSource => {
  const { componentEvalDataValuesMap, tool } = useActiveTool();
  const { componentInputs } = useAppSelector((state) => state.activeTool);

  const defaultComponentInputs = useMemo(() => {
    return _.chain(tool.components)
      .keyBy('name')
      .mapValues((component) => COMPONENT_INPUT_TEMPLATES[component.type])
      .value();
  }, [tool.components]);

  const lookupMap = useMemo(
    () =>
      _.merge(
        {},
        GLOBAL_LIBRARY_MAP,
        componentEvalDataValuesMap,
        defaultComponentInputs,
        componentInputs
      ),
    [componentEvalDataValuesMap, componentInputs, defaultComponentInputs]
  );

  const rootOptions = useMemo(() => {
    const options: Completion[] = [];

    GLOBAL_LIBRARIES.forEach(({ importName, library }) => {
      const librarySnippet = snippetCompletion(
        createAutocompleteSnippetTemplate(importName),
        {
          label: importName,
          detail: typeof library,
          boost: 1,
        }
      );
      options.push(librarySnippet);
    });

    Object.entries(componentEvalDataValuesMap).forEach(([componentName]) => {
      const componentSnippet = snippetCompletion(
        createAutocompleteSnippetTemplate(componentName),
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
      const currToken = parseTokenFromContext(context);

      if (!currToken) {
        return { from: context.pos, options: [] };
      }

      if (currToken.isRoot) {
        return { from: currToken.from, options: rootOptions };
      }

      const currValue = _.get(lookupMap, currToken.token);
      return {
        from: currToken.from,
        options: createAutocompleteSnippets(currValue),
      };
    },
    [rootOptions, lookupMap]
  );

  return getAutocompleteOptions;
};
