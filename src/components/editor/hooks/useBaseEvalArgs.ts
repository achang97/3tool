import { GLOBAL_LIBRARIES } from '@app/constants';
import { useAppSelector } from '@app/redux/hooks';
import _ from 'lodash';
import { useMemo } from 'react';
import { readAsModule } from '../utils/codemirror';

export const GLOBAL_LIBRARY_MAP = _.chain(GLOBAL_LIBRARIES)
  .keyBy('importName')
  .mapValues(({ library, isModule }) => {
    return isModule ? readAsModule(library) : library;
  })
  .value();

export const useBaseEvalArgs = () => {
  const { componentInputs, actionResults } = useAppSelector(
    (state) => state.activeTool
  );

  const evalArgs = useMemo(() => {
    return _.merge({}, GLOBAL_LIBRARY_MAP, componentInputs, actionResults);
  }, [actionResults, componentInputs]);

  return evalArgs;
};
