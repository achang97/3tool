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
  useToolEvalDataMaps,
  ToolEvalDataMap,
  ToolEvalDataValuesMap,
} from '../hooks/useToolEvalDataMaps';
import { useToolDataDepGraph } from '../hooks/useToolDataDepGraph';
import { useEnqueueSnackbar } from '../hooks/useEnqueueSnackbar';

const DEFAULT_STATE = {
  tool: {} as Tool,
  updateTool: async () => undefined,
  dataDepGraph: new DepGraph<string>(),
  evalDataMap: {},
  evalDataValuesMap: {},
};

export type ActiveToolState = {
  tool: Tool;
  updateTool: (
    update: Partial<Pick<Tool, 'name' | 'components' | 'actions'>>
  ) => Promise<ApiResponse<Tool> | undefined>;
  dataDepGraph: DepGraph<string>;
  evalDataMap: ToolEvalDataMap;
  evalDataValuesMap: ToolEvalDataValuesMap;
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

  const { dataDepGraph, cyclePath } = useToolDataDepGraph(activeTool);
  const enqueueSnackbar = useEnqueueSnackbar();

  const { evalDataMap, evalDataValuesMap } = useToolEvalDataMaps({
    tool: activeTool,
    dataDepGraph,
  });

  const displayErrorSnackbar = useCallback(
    (error: string) => {
      enqueueSnackbar(error, {
        variant: 'error',
      });
    },
    [enqueueSnackbar]
  );

  useEffect(() => {
    if (updateError) {
      displayErrorSnackbar(parseApiError(updateError));
    }
  }, [displayErrorSnackbar, updateError]);

  useEffect(() => {
    if (cyclePath) {
      displayErrorSnackbar(`Dependency Cycle Found: ${cyclePath.join(' → ')}`);
    }
  }, [cyclePath, displayErrorSnackbar]);

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
      dataDepGraph,
      evalDataMap,
      evalDataValuesMap,
    };
  }, [
    activeTool,
    updateActiveTool,
    dataDepGraph,
    evalDataMap,
    evalDataValuesMap,
  ]);

  return (
    <ActiveToolContext.Provider value={contextValue}>
      {children}
    </ActiveToolContext.Provider>
  );
};
