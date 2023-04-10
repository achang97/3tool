import { Component } from '@app/types';
import _ from 'lodash';
import { useMemo } from 'react';
import { EvalResult } from '../utils/eval';
import { useComponentEvalData } from './useComponentEvalData';
import { useElementFlattenFields } from './useElementFlattenFields';

export type ComponentEvalError = {
  name: string;
  error: Error;
};

export const useComponentEvalErrors = (component: Component): ComponentEvalError[] => {
  const { evalData } = useComponentEvalData(component.name);
  const flattenElement = useElementFlattenFields({
    includePrefix: false,
    onlyLeaves: true,
  });

  const evalErrors = useMemo(() => {
    const errors: ComponentEvalError[] = [];

    flattenElement(component).fields.forEach((field) => {
      const fieldEvalData: EvalResult = _.get(evalData, field.name);
      if (!fieldEvalData || !(fieldEvalData.error instanceof Error)) {
        return;
      }

      errors.push({
        name: field.name,
        error: fieldEvalData.error,
      });
    });

    return errors;
  }, [component, evalData, flattenElement]);

  return evalErrors;
};
