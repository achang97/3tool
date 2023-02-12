import _ from 'lodash';
import { ReactNode, useMemo } from 'react';
import { EvalResult } from '../utils/eval';

export type Preview = {
  alertType: 'success' | 'error';
  type?: string;
  message: ReactNode;
};

export const useDynamicTextFieldPreview = (
  evalResult?: EvalResult
): Preview => {
  const previewData: Preview | undefined = useMemo(() => {
    if (_.isEmpty(evalResult)) {
      return {
        alertType: 'error',
        message:
          'Failed evaluation: please check that you have resolved all dependency cycles.',
      };
    }

    const { value, parsedExpression, error } = evalResult;

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
  }, [evalResult]);

  return previewData;
};
