import { dynamicJavascriptLanguage } from '@app/codemirror/dynamicJavascript/language';
import { CompletionContext } from '@codemirror/autocomplete';
import { javascript, javascriptLanguage } from '@codemirror/lang-javascript';
import { EditorState } from '@codemirror/state';

export const createCompletionContext = (
  doc: string,
  pos: number,
  dynamic = true
): CompletionContext => {
  const state = EditorState.create({
    doc,
    extensions: dynamic
      ? [dynamicJavascriptLanguage, javascript().support]
      : [javascriptLanguage],
  });
  return new CompletionContext(state, pos, false);
};
