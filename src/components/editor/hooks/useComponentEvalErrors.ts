import { Component } from '@app/types';
import _ from 'lodash';
import { useMemo } from 'react';
import { getComponentData } from '../utils/components';
import { flattenObjectFields } from '../utils/javascript';
import { useComponentEvalData } from './useComponentEvalData';

export type ComponentEvalError = {
  name: string;
  error: Error;
};

export const useComponentEvalErrors = (
  component: Component
): ComponentEvalError[] => {
  const { evalData } = useComponentEvalData(component.name);

  const evalErrors = useMemo(() => {
    const errors: ComponentEvalError[] = [];

    flattenObjectFields(getComponentData(component)).forEach((field) => {
      const fieldEvalData = _.get(evalData, field.name);
      if (!fieldEvalData || !(fieldEvalData.error instanceof Error)) {
        return;
      }

      errors.push({
        name: field.name,
        error: fieldEvalData.error,
      });
    });

    return errors;
  }, [component, evalData]);

  return evalErrors;
};
