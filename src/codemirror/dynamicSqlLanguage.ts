import { javascriptLanguage } from '@codemirror/lang-javascript';
import { sql, StandardSQL } from '@codemirror/lang-sql';
import { LRLanguage } from '@codemirror/language';
import { parseMixed } from '@lezer/common';
import { parser } from './dynamicLanguage/parser';

export const sqlLanguage = sql({ dialect: StandardSQL });

const dynamicSqlParser = parser.configure({
  wrap: parseMixed((node) => {
    if (node.name === 'DynamicTerm') {
      return { parser: javascriptLanguage.parser };
    }

    return node.type.isTop
      ? {
          parser: sqlLanguage.language.parser,
          overlay: (overlayNode) => {
            return overlayNode.type.name !== 'DynamicTerm';
          },
        }
      : null;
  }),
});

export const dynamicSqlLanguage = LRLanguage.define({
  parser: dynamicSqlParser,
});
