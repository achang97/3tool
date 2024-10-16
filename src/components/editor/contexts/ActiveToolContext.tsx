import { useUpdateToolMutation } from '@app/redux/services/tools';
import { Tool } from '@app/types';
import { parseApiError } from '@app/utils/api';
import { DepGraph } from 'dependency-graph';
import React, { useCallback, createContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { useEnqueueSnackbar } from '@app/hooks/useEnqueueSnackbar';
import {
  useToolEvalDataMaps,
  ToolEvalDataMap,
  ToolEvalDataValuesMap,
} from '../hooks/useToolEvalDataMaps';
import { useToolDataDepGraph } from '../hooks/useToolDataDepGraph';

const DEFAULT_STATE = {
  tool: {} as Tool,
  updateTool: async () => undefined,
  dataDepGraph: new DepGraph<string>(),
  dataDepCycles: {},
  evalDataMap: {},
  evalDataValuesMap: {},
};

export type ActiveToolState = {
  tool: Tool;
  updateTool: (
    update: Partial<Pick<Tool, 'name' | 'components' | 'actions'>>
  ) => Promise<Tool | undefined>;
  dataDepGraph: DepGraph<string>;
  dataDepCycles: Record<string, string[]>;
  evalDataMap: ToolEvalDataMap;
  evalDataValuesMap: ToolEvalDataValuesMap;
};

export const ActiveToolContext = createContext<ActiveToolState>(DEFAULT_STATE);

type ActiveToolProviderProps = {
  tool: Tool;
  children?: ReactNode;
};

export const ActiveToolProvider = ({ tool, children }: ActiveToolProviderProps) => {
  const [activeTool, setActiveTool] = useState<Tool>(tool);
  const [updateTool] = useUpdateToolMutation();

  const { dataDepGraph, dataDepCycles } = useToolDataDepGraph(activeTool);
  const enqueueSnackbar = useEnqueueSnackbar();

  const { evalDataMap, evalDataValuesMap } = useToolEvalDataMaps({
    tool: activeTool,
    dataDepGraph,
    dataDepCycles,
  });

  useEffect(() => {
    if (tool) {
      setActiveTool(tool);
    }
  }, [tool]);

  const updateActiveTool = useCallback(
    async (update: Partial<Pick<Tool, 'name' | 'components' | 'actions'>>) => {
      try {
        const updatedTool = await updateTool({
          _id: activeTool._id,
          ...update,
        }).unwrap();

        setActiveTool(updatedTool);
        return updatedTool;
      } catch (e) {
        enqueueSnackbar(parseApiError(e), {
          variant: 'error',
        });
        return undefined;
      }
    },
    [activeTool._id, enqueueSnackbar, updateTool]
  );

  const contextValue = useMemo(() => {
    return {
      tool: activeTool,
      updateTool: updateActiveTool,
      dataDepGraph,
      dataDepCycles,
      evalDataMap,
      evalDataValuesMap,
    };
  }, [activeTool, updateActiveTool, dataDepGraph, dataDepCycles, evalDataMap, evalDataValuesMap]);

  return <ActiveToolContext.Provider value={contextValue}>{children}</ActiveToolContext.Provider>;
};
