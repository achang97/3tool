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
  useToolEvalDataMaps,
} from '../../hooks/useToolEvalDataMaps';
import { ActiveToolContext, ActiveToolProvider } from '../ActiveToolContext';

const mockUpdateTool = jest.fn();
const mockEnqueueSnackbar = jest.fn();

jest.mock('../../hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => mockEnqueueSnackbar),
}));

jest.mock('../../hooks/useToolDataDepGraph');
jest.mock('../../hooks/useToolEvalDataMaps');
jest.mock('@app/redux/services/tools');

describe('ActiveToolContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useUpdateToolMutation as jest.Mock).mockImplementation(() => [
      mockUpdateTool,
      {},
    ]);

    (useToolEvalDataMaps as jest.Mock).mockImplementation(() => ({}));
    (useToolDataDepGraph as jest.Mock).mockImplementation(() => ({}));
    mockUpdateTool.mockClear();
  });

  it('returns default state', () => {
    const { result } = renderHook(() => useContext(ActiveToolContext));
    expect(result.current).toEqual({
      tool: {},
      updateTool: expect.any(Function),
      dataDepGraph: new DepGraph<string>(),
      dataDepCycles: {},
      evalDataMap: {},
      evalDataValuesMap: {},
    });
  });

  it('returns given tool prop as tool before any updates', () => {
    const { result } = renderHook(() => useContext(ActiveToolContext), {
      wrapper: ({ children }: { children: ReactElement }) => (
        <ActiveToolProvider tool={mockTool}>{children}</ActiveToolProvider>
      ),
    });
    expect(result.current.tool).toEqual(mockTool);
  });

  describe('dep graph', () => {
    it('returns dataDepGraph', () => {
      const mockElementDataDepGraph = new DepGraph<string>();
      mockElementDataDepGraph.addNode('button1');
      mockElementDataDepGraph.addNode('button2');
      mockElementDataDepGraph.addDependency('button1', 'button2');

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

    it('returns dataDepGraph', () => {
      const mockDataDepCycles = {
        'button1.text': ['1', '2'],
      };
      (useToolDataDepGraph as jest.Mock).mockImplementation(() => ({
        dataDepCycles: mockDataDepCycles,
      }));

      const { result } = renderHook(() => useContext(ActiveToolContext), {
        wrapper: ({ children }: { children: ReactElement }) => (
          <ActiveToolProvider tool={mockTool}>{children}</ActiveToolProvider>
        ),
      });
      expect(result.current.dataDepCycles).toEqual(mockDataDepCycles);
    });
  });

  describe('eval maps', () => {
    it('returns evalDataValuesMap', () => {
      const mockElementEvalDataValuesMap: ToolEvalDataValuesMap = {
        button1: {
          text: 'hello',
        },
      };
      (useToolEvalDataMaps as jest.Mock).mockImplementation(() => ({
        evalDataValuesMap: mockElementEvalDataValuesMap,
      }));

      const { result } = renderHook(() => useContext(ActiveToolContext), {
        wrapper: ({ children }: { children: ReactElement }) => (
          <ActiveToolProvider tool={mockTool}>{children}</ActiveToolProvider>
        ),
      });
      expect(result.current.evalDataValuesMap).toEqual(
        mockElementEvalDataValuesMap
      );
    });

    it('returns evalDataMap', () => {
      const mockElementEvalDataMap: ToolEvalDataMap = {
        button1: {
          text: {
            parsedExpression: 'hello',
            value: 'hello',
          },
        },
      };
      (useToolEvalDataMaps as jest.Mock).mockImplementation(() => ({
        evalDataMap: mockElementEvalDataMap,
      }));

      const { result } = renderHook(() => useContext(ActiveToolContext), {
        wrapper: ({ children }: { children: ReactElement }) => (
          <ActiveToolProvider tool={mockTool}>{children}</ActiveToolProvider>
        ),
      });
      expect(result.current.evalDataMap).toEqual(mockElementEvalDataMap);
    });
  });

  describe('update', () => {
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
  });
});
