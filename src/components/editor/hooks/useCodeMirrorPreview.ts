import { FieldType } from '@app/types';
import { ReactNode, useMemo } from 'react';
import { evalDynamicExpression } from '../utils/eval';
import { useEvalArgs } from './useEvalArgs';

export type Preview = {
  alertType: 'success' | 'error';
  type?: string;
  message: ReactNode;
};

type HookArgs = {
  type: FieldType;
  expression?: string;
  isDynamic: boolean;
};

export const useCodeMirrorPreview = ({
  type,
  isDynamic,
  expression = '',
}: HookArgs): Preview | null => {
  // NOTE: We pass isDynamic as true instead of the given variable value, as we never
  // want to include static eval args (like action functions and utils).
  const { dynamicEvalArgs } = useEvalArgs();

  const previewData: Preview | null = useMemo(() => {
    if (!isDynamic) {
      return null;
    }

    const { value, parsedExpression, error } = evalDynamicExpression(
      expression,
      type,
      dynamicEvalArgs
    );

    if (error) {
      return {
        alertType: 'error',
        message: error.message,
      };
    }

    const successPreview: Preview = {
      alertType: 'success',
      type: typeof value,
      message: JSON.stringify(value),
    };

    switch (typeof value) {
      case 'object': {
        if (Array.isArray(value)) {
          successPreview.type = `array (${(value as unknown[]).length})`;
          break;
        }

        if (value === null) {
          successPreview.type = 'null';
          successPreview.message = null;
          break;
        }

        break;
      }
      case 'boolean': {
        successPreview.message = `"${parsedExpression}" → ${value.toString()}`;
        break;
      }
      default:
        break;
    }

    return successPreview;
  }, [dynamicEvalArgs, expression, isDynamic, type]);

  return previewData;
};
