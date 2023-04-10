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

export type EvalDataValues<T extends ComponentType> = Partial<NonNullable<ComponentEvalData[T]>>;

type HookReturnType<T extends ComponentType> = {
  evalData: EvalData<T>;
  evalDataValues: EvalDataValues<T>;
};

export const useComponentEvalData = <T extends ComponentType>(name: string): HookReturnType<T> => {
  const { evalDataMap, evalDataValuesMap } = useActiveTool();

  const evalData = useMemo(() => {
    return (evalDataMap[name] as EvalData<T>) ?? {};
  }, [evalDataMap, name]);

  const evalDataValues = useMemo(() => {
    return (evalDataValuesMap[name] as EvalDataValues<T>) ?? {};
  }, [evalDataValuesMap, name]);

  return { evalData, evalDataValues };
};
