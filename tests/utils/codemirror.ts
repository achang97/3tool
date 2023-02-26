import { dynamicTextLanguage } from '@app/codemirror/dynamicTextLanguage';
import { CompletionContext } from '@codemirror/autocomplete';
import { javascript, javascriptLanguage } from '@codemirror/lang-javascript';
import { EditorState } from '@codemirror/state';

export const createCompletionContext = (
  doc: string,
  pos: number,
  isDynamic: boolean
): CompletionContext => {
  const state = EditorState.create({
    doc,
    extensions: isDynamic
      ? [dynamicTextLanguage, javascript().support]
      : [javascriptLanguage],
  });
  return new CompletionContext(state, pos, false);
};
