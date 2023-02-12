import { useAppSelector } from '@app/redux/hooks';
import { ComponentInputs } from '@app/constants';
import { useMemo } from 'react';

export type Inputs<T extends keyof ComponentInputs> = Partial<
  ComponentInputs[T]
>;

export const useComponentInputs = <T extends keyof ComponentInputs>(
  name: string
): Inputs<T> => {
  const { componentInputs } = useAppSelector((state) => state.activeTool);

  const input = useMemo(() => {
    return componentInputs[name] ?? {};
  }, [componentInputs, name]);

  return input;
};
