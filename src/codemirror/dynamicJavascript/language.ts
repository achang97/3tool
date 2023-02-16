import { parser } from '@app/codemirror/dynamicJavascript/parser';
import { javascriptLanguage } from '@codemirror/lang-javascript';
import { LRLanguage } from '@codemirror/language';
import { parseMixed } from '@lezer/common';

const dynamicJavascriptParser = parser.configure({
  wrap: parseMixed((node) => {
    return node.name === 'DynamicTerm'
      ? { parser: javascriptLanguage.parser }
      : null;
  }),
});

export const dynamicJavascriptLanguage = LRLanguage.define({
  parser: dynamicJavascriptParser,
});
