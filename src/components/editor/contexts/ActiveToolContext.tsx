import { setSnackbarMessage } from '@app/redux/features/editorSlice';
import { useAppDispatch } from '@app/redux/hooks';
import { useUpdateToolMutation } from '@app/redux/services/tools';
import { ApiResponse, Tool } from '@app/types';
import { parseApiError } from '@app/utils/api';
import { DepGraph } from 'dependency-graph';
import React, {
  useCallback,
  createContext,
  ReactNode,
  useMemo,
  useEffect,
  useState,
} from 'react';
import {
  useComponentEvalDataMaps,
  ComponentEvalDataMap,
  ComponentEvalDataValuesMap,
} from '../hooks/useComponentEvalDataMaps';
import { useComponentDataDepGraph } from '../hooks/useComponentDataDepGraph';

const DEFAULT_STATE = {
  tool: {} as Tool,
  updateTool: async () => undefined,
  componentDataDepGraph: new DepGraph<string>(),
  componentEvalDataMap: {},
  componentEvalDataValuesMap: {},
};

export type ActiveToolState = {
  tool: Tool;
  updateTool: (
    update: Partial<Pick<Tool, 'name' | 'components' | 'actions'>>
  ) => Promise<ApiResponse<Tool> | undefined>;
  componentDataDepGraph: DepGraph<string>;
  componentEvalDataMap: ComponentEvalDataMap;
  componentEvalDataValuesMap: ComponentEvalDataValuesMap;
};

export const ActiveToolContext = createContext<ActiveToolState>(DEFAULT_STATE);

type ActiveToolProviderProps = {
  tool: Tool;
  children?: ReactNode;
};

export const ActiveToolProvider = ({
  tool,
  children,
}: ActiveToolProviderProps) => {
  const [activeTool, setActiveTool] = useState<Tool>(tool);
  const [updateTool, { error: updateError, data: updatedTool }] =
    useUpdateToolMutation();

  const componentDataDepGraph = useComponentDataDepGraph(activeTool.components);

  const {
    componentEvalDataMap,
    componentEvalDataValuesMap,
    error: evalError,
  } = useComponentEvalDataMaps({
    components: activeTool.components,
    componentDataDepGraph,
  });

  const dispatch = useAppDispatch();

  const displayErrorSnackbar = useCallback(
    (error: string) => {
      dispatch(
        setSnackbarMessage({
          type: 'error',
          message: error,
        })
      );
    },
    [dispatch]
  );

  useEffect(() => {
    if (updateError) {
      displayErrorSnackbar(parseApiError(updateError));
    }
  }, [displayErrorSnackbar, updateError]);

  useEffect(() => {
    if (evalError) {
      displayErrorSnackbar(evalError.message);
    }
  }, [displayErrorSnackbar, evalError]);

  useEffect(() => {
    if (updatedTool) {
      setActiveTool(updatedTool);
    }
  }, [updatedTool]);

  const updateActiveTool = useCallback(
    async (update: Partial<Pick<Tool, 'name' | 'components'>>) => {
      return updateTool({
        id: activeTool.id,
        ...update,
      });
    },
    [activeTool.id, updateTool]
  );

  const contextValue = useMemo(() => {
    return {
      tool: activeTool,
      updateTool: updateActiveTool,
      componentDataDepGraph,
      componentEvalDataMap,
      componentEvalDataValuesMap,
    };
  }, [
    activeTool,
    updateActiveTool,
    componentDataDepGraph,
    componentEvalDataMap,
    componentEvalDataValuesMap,
  ]);

  return (
    <ActiveToolContext.Provider value={contextValue}>
      {children}
    </ActiveToolContext.Provider>
  );
};
