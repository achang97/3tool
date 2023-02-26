import { javascriptLanguage } from '@codemirror/lang-javascript';
import { LRLanguage } from '@codemirror/language';
import { parseMixed } from '@lezer/common';
import { parser } from './dynamicLanguage/parser';

const dynamicTextParser = parser.configure({
  wrap: parseMixed((node) => {
    return node.name === 'DynamicTerm'
      ? { parser: javascriptLanguage.parser }
      : null;
  }),
});

export const dynamicTextLanguage = LRLanguage.define({
  parser: dynamicTextParser,
});
