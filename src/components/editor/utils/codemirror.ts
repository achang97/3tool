import {
  Completion,
  CompletionContext,
  snippetCompletion,
} from '@codemirror/autocomplete';
import { syntaxTree } from '@codemirror/language';
import { SyntaxNode } from '@lezer/common';
import _ from 'lodash';

export const createAutocompleteSnippet = (
  label: string,
  value: unknown,
  { boost, detail }: { boost?: number; detail?: string } = {}
): Completion => {
  let customDetail: string;
  if (detail) {
    customDetail = detail;
  } else if (Array.isArray(value)) {
    customDetail = 'array';
  } else if (value === null) {
    customDetail = 'null';
  } else {
    customDetail = typeof value;
  }

  return snippetCompletion(`${label}#{1}`, {
    label,
    detail: customDetail,
    boost,
  });
};

export const createAutocompleteSnippets = (
  data: unknown,
  { boost }: { boost?: number } = {}
): Completion[] => {
  const createAutocompleteSnippetsHelper = (
    prefix: string,
    value: unknown,
    snippets: Completion[]
  ) => {
    if (prefix) {
      snippets.push(createAutocompleteSnippet(prefix, value, { boost }));
    }

    if (value === null || value === undefined) {
      return;
    }

    if (typeof value !== 'object' || Array.isArray(value)) {
      return;
    }

    Object.entries(value).forEach(([entryKey, entryVal]) => {
      createAutocompleteSnippetsHelper(
        `${prefix}.${entryKey}`,
        entryVal,
        snippets
      );
    });
  };

  const snippets: Completion[] = [];
  createAutocompleteSnippetsHelper('', data, snippets);
  return snippets;
};

export const parseTokenFromContext = (
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

  if (!token || token === '.') {
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
