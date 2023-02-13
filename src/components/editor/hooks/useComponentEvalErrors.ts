import { Component } from '@app/types';
import _ from 'lodash';
import { useMemo } from 'react';
import {
  flattenComponentDataFields,
  parseComponentFieldName,
} from '../utils/components';
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

    flattenComponentDataFields(component).forEach((field) => {
      if (!field.isLeaf) {
        return;
      }

      const { fieldName } = parseComponentFieldName(field.name);
      if (!fieldName) {
        return;
      }

      const fieldEvalData = _.get(evalData, fieldName);
      if (!fieldEvalData || !(fieldEvalData.error instanceof Error)) {
        return;
      }

      errors.push({
        name: fieldName,
        error: fieldEvalData.error,
      });
    });

    return errors;
  }, [component, evalData]);

  return evalErrors;
};
