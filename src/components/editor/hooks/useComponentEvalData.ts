import { ComponentEvalData } from '@app/constants';
import { ComponentType } from '@app/types';
import { useMemo } from 'react';
import { EvalResult } from '../utils/eval';
import { useActiveTool } from './useActiveTool';

export type EvalData<T extends ComponentType> = Partial<
  {
    [KeyType in keyof NonNullable<ComponentEvalData[T]>]: EvalResult<
      NonNullable<ComponentEvalData[T]>[KeyType]
    >;
  }
>;

export type EvalDataValues<T extends ComponentType> = Partial<
  NonNullable<ComponentEvalData[T]>
>;

type HookReturnType<T extends ComponentType> = {
  evalData: EvalData<T>;
  evalDataValues: EvalDataValues<T>;
};

export const useComponentEvalData = <T extends ComponentType>(
  name: string
): HookReturnType<T> => {
  const { componentEvalDataMap, componentEvalDataValuesMap } = useActiveTool();

  const evalData = useMemo(() => {
    return (componentEvalDataMap[name] as EvalData<T>) ?? {};
  }, [componentEvalDataMap, name]);

  const evalDataValues = useMemo(() => {
    return (componentEvalDataValuesMap[name] as EvalDataValues<T>) ?? {};
  }, [componentEvalDataValuesMap, name]);

  return { evalData, evalDataValues };
};
