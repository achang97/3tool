import { dynamicSqlLanguage, sqlLanguage } from '@app/codemirror/dynamicSqlLanguage';
import { dynamicTextLanguage } from '@app/codemirror/dynamicTextLanguage';
import { CompletionSource } from '@codemirror/autocomplete';
import { javascriptLanguage } from '@codemirror/lang-javascript';
import { renderHook } from '@testing-library/react';
import _ from 'lodash';
import { BASE_EXTENSIONS, useCodeMirrorProps } from '../useCodeMirrorProps';

const mockJavascriptAutocomplete: CompletionSource = () => ({
  from: 0,
  options: [],
});

jest.mock('../../hooks/useCodeMirrorJavascriptAutocomplete', () => ({
  useCodeMirrorJavascriptAutocomplete: jest.fn(() => mockJavascriptAutocomplete),
}));

describe('useCodeMirrorProps', () => {
  describe('basicSetup', () => {
    it('returns options without line numbers if showLineNumbers is false', () => {
      const { result } = renderHook(() =>
        useCodeMirrorProps({
          language: 'text',
          isDynamic: false,
          isFocused: false,
          hasError: false,
          showLineNumbers: false,
        })
      );
      expect(result.current.basicSetup).toEqual({
        highlightActiveLineGutter: false,
        highlightActiveLine: false,
        tabSize: 4,
        lineNumbers: false,
        foldGutter: false,
        indentOnInput: false,
      });
    });

    it('returns options without line numbers if showLineNumbers is true', () => {
      const { result } = renderHook(() =>
        useCodeMirrorProps({
          language: 'text',
          isDynamic: false,
          isFocused: false,
          hasError: false,
          showLineNumbers: true,
        })
      );
      expect(result.current.basicSetup).toEqual({
        highlightActiveLineGutter: false,
        highlightActiveLine: false,
        tabSize: 4,
        lineNumbers: true,
        foldGutter: true,
        indentOnInput: false,
      });
    });
  });

  describe('extensions', () => {
    const removeId = (object: object) => {
      return _.omit(object, 'id');
    };

    it('returns extensions for text', () => {
      const { result } = renderHook(() =>
        useCodeMirrorProps({
          language: 'text',
          isDynamic: false,
          isFocused: false,
          hasError: false,
          showLineNumbers: false,
        })
      );
      expect(result.current.extensions).toMatchObject([
        ...BASE_EXTENSIONS,
        removeId(
          javascriptLanguage.data.of({
            autocomplete: mockJavascriptAutocomplete,
          })
        ),
        dynamicTextLanguage,
      ]);
    });

    it('returns extensions for javascript', () => {
      const { result } = renderHook(() =>
        useCodeMirrorProps({
          language: 'javascript',
          isDynamic: false,
          isFocused: false,
          hasError: false,
          showLineNumbers: false,
        })
      );
      expect(result.current.extensions).toMatchObject([
        ...BASE_EXTENSIONS,
        removeId(
          javascriptLanguage.data.of({
            autocomplete: mockJavascriptAutocomplete,
          })
        ),
        javascriptLanguage,
      ]);
    });

    it('returns extensions for sql', () => {
      const { result } = renderHook(() =>
        useCodeMirrorProps({
          language: 'sql',
          isDynamic: false,
          isFocused: false,
          hasError: false,
          showLineNumbers: false,
        })
      );
      expect(result.current.extensions).toMatchObject([
        ...BASE_EXTENSIONS,
        removeId(
          javascriptLanguage.data.of({
            autocomplete: mockJavascriptAutocomplete,
          })
        ),
        sqlLanguage.support,
        dynamicSqlLanguage,
      ]);
    });
  });

  describe('className', () => {
    describe('not dynamic', () => {
      it('returns empty string', () => {
        const { result } = renderHook(() =>
          useCodeMirrorProps({
            language: 'javascript',
            isDynamic: false,
            isFocused: true,
            hasError: true,
            showLineNumbers: true,
          })
        );
        expect(result.current.className).toEqual('');
      });
    });

    describe('dynamic', () => {
      it('includes "dynamic-focused" class if focused', () => {
        const { result } = renderHook(() =>
          useCodeMirrorProps({
            language: 'text',
            isDynamic: true,
            isFocused: true,
            hasError: true,
            showLineNumbers: true,
          })
        );
        expect(result.current.className).toMatch('dynamic-focused');
      });

      it('does not include "dynamic-focused" class if not focused', () => {
        const { result } = renderHook(() =>
          useCodeMirrorProps({
            language: 'text',
            isDynamic: true,
            isFocused: false,
            hasError: true,
            showLineNumbers: true,
          })
        );
        expect(result.current.className).not.toMatch('dynamic-focused');
      });

      it('includes "dynamic-error" class if error', () => {
        const { result } = renderHook(() =>
          useCodeMirrorProps({
            language: 'text',
            isDynamic: true,
            isFocused: true,
            hasError: true,
            showLineNumbers: true,
          })
        );
        expect(result.current.className).toMatch('dynamic-error');
      });

      it('does not include "dynamic-error" class if error', () => {
        const { result } = renderHook(() =>
          useCodeMirrorProps({
            language: 'text',
            isDynamic: true,
            isFocused: true,
            hasError: false,
            showLineNumbers: true,
          })
        );
        expect(result.current.className).not.toMatch('dynamic-error');
      });
    });
  });
});
