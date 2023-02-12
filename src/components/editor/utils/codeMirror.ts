import {
  Completion,
  CompletionContext,
  snippetCompletion,
} from '@codemirror/autocomplete';
import { syntaxTree } from '@codemirror/language';
import { SyntaxNode } from '@lezer/common';
import _ from 'lodash';

export const parseDynamicTerms = (
  expression: string
): {
  group: string;
  expression: string;
  start: number;
}[] => {
  const dynamicJavascriptRegex = /{{(?<={{)\s*(.*?)\s*(?=}})}}/g;
  return [...expression.matchAll(dynamicJavascriptRegex)].map((group) => {
    const start = group.index ?? 0;

    return {
      group: group[0],
      expression: group[1],
      start,
    };
  });
};

export const getSnippetTemplate = (str: string): string => {
  return `${str}#{1}`;
};

export const generateSnippets = (data: unknown): Completion[] => {
  const generateSnippetsHelper = (
    prefix: string,
    value: unknown,
    snippets: Completion[]
  ) => {
    if (prefix) {
      let detail: string;
      if (Array.isArray(value)) {
        detail = 'array';
      } else if (value === null) {
        detail = 'null';
      } else {
        detail = typeof value;
      }

      const newSnippet = snippetCompletion(getSnippetTemplate(prefix), {
        label: prefix,
        detail,
      });
      snippets.push(newSnippet);
    }

    if (value === null || value === undefined) {
      return;
    }

    if (typeof value !== 'object' || Array.isArray(value)) {
      return;
    }

    Object.entries(value).forEach(([entryKey, entryVal]) => {
      generateSnippetsHelper(`${prefix}.${entryKey}`, entryVal, snippets);
    });
  };

  const snippets: Completion[] = [];
  generateSnippetsHelper('', data, snippets);
  return snippets;
};

export const getTokenFromContext = (
  context: CompletionContext
): {
  token: string;
  from: number;
  isRoot: boolean;
} | null => {
  const getTokenHelper = (node: SyntaxNode | null): string | null => {
    if (!node) {
      return '';
    }

    // Warning name implies invalid JS
    if (['⚠'].includes(node.type.name)) {
      return null;
    }

    if (
      !['VariableName', 'PropertyName', 'MemberExpression', '.'].includes(
        node.type.name
      )
    ) {
      return '';
    }

    const prevChar = context.state.sliceDoc(node.from - 1, node.from);
    if (node.from !== 0 && prevChar !== ' ' && !node.prevSibling) {
      return null;
    }

    const prefix =
      node.from === node.prevSibling?.to
        ? getTokenHelper(node.prevSibling)
        : '';

    if (prefix === null) {
      return null;
    }

    const currName = context.state.sliceDoc(node.from, node.to);
    return `${prefix}${currName}`;
  };

  const tree = syntaxTree(context.state);
  const prevNode = tree.resolveInner(context.pos, -1);
  const token = getTokenHelper(prevNode);

  if (token === null || token === '.') {
    return null;
  }

  const lastPeriodIndex = token.lastIndexOf('.');
  const trimmedToken =
    lastPeriodIndex !== -1 ? token.substring(0, lastPeriodIndex) : token;

  if (lastPeriodIndex === -1) {
    return {
      token: trimmedToken,
      from: context.pos - trimmedToken.length,
      isRoot: true,
    };
  }

  return {
    token: trimmedToken,
    from: context.pos + lastPeriodIndex - token.length,
    isRoot: false,
  };
};

export const readAsModule = (object: unknown): Record<string, unknown> => {
  if (!object) {
    return {};
  }

  return _.chain(Object.entries(object))
    .keyBy((entry) => entry[0])
    .mapValues((entry) => entry[1])
    .value();
};
