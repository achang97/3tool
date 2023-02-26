import { useUpdateToolMutation } from '@app/redux/services/tools';
import { ApiError } from '@app/types';
import { renderHook } from '@testing-library/react';
import { mockTool } from '@tests/constants/data';
import { DepGraph } from 'dependency-graph';
import { ReactElement, useContext } from 'react';
import { useToolDataDepGraph } from '../../hooks/useToolDataDepGraph';
import {
  ToolEvalDataMap,
  ToolEvalDataValuesMap,
} from '../../hooks/useToolEvalDataMaps';
import { ActiveToolContext, ActiveToolProvider } from '../ActiveToolContext';

const mockUpdateTool = jest.fn();
const mockEnqueueSnackbar = jest.fn();

const mockElementDataDepGraph = new DepGraph<string>();
mockElementDataDepGraph.addNode('button1');
mockElementDataDepGraph.addNode('button2');
mockElementDataDepGraph.addDependency('button1', 'button2');

const mockElementEvalDataMap: ToolEvalDataMap = {
  button1: {
    text: {
      parsedExpression: 'hello',
      value: 'hello',
    },
  },
};
const mockElementEvalDataValuesMap: ToolEvalDataValuesMap = {
  button1: {
    text: 'hello',
  },
};

jest.mock('../../hooks/useToolDataDepGraph');

jest.mock('../../hooks/useToolEvalDataMaps', () => ({
  useToolEvalDataMaps: jest.fn(() => ({
    evalDataMap: mockElementEvalDataMap,
    evalDataValuesMap: mockElementEvalDataValuesMap,
  })),
}));

jest.mock('../../hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => mockEnqueueSnackbar),
}));

jest.mock('@app/redux/services/tools');

describe('ActiveToolContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useUpdateToolMutation as jest.Mock).mockImplementation(() => [
      mockUpdateTool,
      {},
    ]);
    (useToolDataDepGraph as jest.Mock).mockImplementation(() => ({
      dataDepGraph: mockElementDataDepGraph,
    }));

    mockUpdateTool.mockClear();
  });

  it('returns default state', () => {
    const { result } = renderHook(() => useContext(ActiveToolContext));
    expect(result.current).toEqual({
      tool: {},
      updateTool: expect.any(Function),
      dataDepGraph: {
        nodes: {},
        outgoingEdges: {},
        incomingEdges: {},
        circular: undefined,
      },
      evalDataMap: {},
      evalDataValuesMap: {},
    });
  });

  it('returns dataDepGraph', () => {
    (useToolDataDepGraph as jest.Mock).mockImplementation(() => ({
      dataDepGraph: mockElementDataDepGraph,
    }));

    const { result } = renderHook(() => useContext(ActiveToolContext), {
      wrapper: ({ children }: { children: ReactElement }) => (
        <ActiveToolProvider tool={mockTool}>{children}</ActiveToolProvider>
      ),
    });
    expect(result.current.dataDepGraph).toEqual(mockElementDataDepGraph);
  });

  it('returns evalDataMap', () => {
    const { result } = renderHook(() => useContext(ActiveToolContext), {
      wrapper: ({ children }: { children: ReactElement }) => (
        <ActiveToolProvider tool={mockTool}>{children}</ActiveToolProvider>
      ),
    });
    expect(result.current.evalDataMap).toEqual(mockElementEvalDataMap);
  });

  it('returns evalDataValuesMap', () => {
    const { result } = renderHook(() => useContext(ActiveToolContext), {
      wrapper: ({ children }: { children: ReactElement }) => (
        <ActiveToolProvider tool={mockTool}>{children}</ActiveToolProvider>
      ),
    });
    expect(result.current.evalDataValuesMap).toEqual(
      mockElementEvalDataValuesMap
    );
  });

  it('returns given tool prop as tool before any updates', () => {
    const { result } = renderHook(() => useContext(ActiveToolContext), {
      wrapper: ({ children }: { children: ReactElement }) => (
        <ActiveToolProvider tool={mockTool}>{children}</ActiveToolProvider>
      ),
    });
    expect(result.current.tool).toEqual(mockTool);
  });

  it('returns updated tool as tool after successful update', () => {
    const mockUpdatedTool = {
      ...mockTool,
      name: 'Updated Tool Name',
    };
    (useUpdateToolMutation as jest.Mock).mockImplementation(() => [
      mockUpdateTool,
      { data: mockUpdatedTool },
    ]);

    const { result } = renderHook(() => useContext(ActiveToolContext), {
      wrapper: ({ children }: { children: ReactElement }) => (
        <ActiveToolProvider tool={mockTool}>{children}</ActiveToolProvider>
      ),
    });

    expect(result.current.tool).toEqual(mockUpdatedTool);
  });

  it('updateTool calls API to update tool with original tool id', () => {
    const { result } = renderHook(() => useContext(ActiveToolContext), {
      wrapper: ({ children }: { children: ReactElement }) => (
        <ActiveToolProvider tool={mockTool}>{children}</ActiveToolProvider>
      ),
    });

    const mockToolUpdate = { name: 'Updated Tool Name' };
    result.current.updateTool(mockToolUpdate);

    expect(mockUpdateTool).toHaveBeenCalledWith({
      id: mockTool.id,
      ...mockToolUpdate,
    });
  });

  describe('error', () => {
    it('does not display error snackbar if update succeeds', () => {
      (useUpdateToolMutation as jest.Mock).mockImplementation(() => [
        mockUpdateTool,
        { error: undefined },
      ]);

      renderHook(() => useContext(ActiveToolContext), {
        wrapper: ({ children }: { children: ReactElement }) => (
          <ActiveToolProvider tool={mockTool}>{children}</ActiveToolProvider>
        ),
      });

      expect(mockEnqueueSnackbar).not.toHaveBeenCalled();
    });

    it('displays error snackbar if update fails', () => {
      const mockApiError: ApiError = {
        status: 400,
        data: {
          message: 'Error Message',
        },
      };
      (useUpdateToolMutation as jest.Mock).mockImplementation(() => [
        mockUpdateTool,
        { error: mockApiError },
      ]);

      renderHook(() => useContext(ActiveToolContext), {
        wrapper: ({ children }: { children: ReactElement }) => (
          <ActiveToolProvider tool={mockTool}>{children}</ActiveToolProvider>
        ),
      });

      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        mockApiError.data!.message,
        { variant: 'error' }
      );
    });

    it('does not display error snackbar if there is no cycle in dependency graph', () => {
      (useToolDataDepGraph as jest.Mock).mockImplementation(() => ({
        cyclePath: undefined,
      }));

      renderHook(() => useContext(ActiveToolContext), {
        wrapper: ({ children }: { children: ReactElement }) => (
          <ActiveToolProvider tool={mockTool}>{children}</ActiveToolProvider>
        ),
      });

      expect(mockEnqueueSnackbar).not.toHaveBeenCalled();
    });

    it('displays error snackbar if there is cycle in dependency graph', () => {
      (useToolDataDepGraph as jest.Mock).mockImplementation(() => ({
        cyclePath: ['button1.text', 'button1.disabled', 'button1.text'],
      }));

      renderHook(() => useContext(ActiveToolContext), {
        wrapper: ({ children }: { children: ReactElement }) => (
          <ActiveToolProvider tool={mockTool}>{children}</ActiveToolProvider>
        ),
      });

      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        'Dependency Cycle Found: button1.text → button1.disabled → button1.text',
        {
          variant: 'error',
        }
      );
    });
  });
});
