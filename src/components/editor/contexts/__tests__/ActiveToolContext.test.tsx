import { screen, render, renderHook, waitFor } from '@testing-library/react';
import { mockTool } from '@tests/constants/data';
import { DepGraph } from 'dependency-graph';
import { ReactElement, useContext } from 'react';
import { Tool } from '@app/types';
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

jest.mock('@app/redux/services/tools', () => ({
  useUpdateToolMutation: jest.fn(() => [mockUpdateTool]),
}));

describe('ActiveToolContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useToolEvalDataMaps as jest.Mock).mockImplementation(() => ({}));
    (useToolDataDepGraph as jest.Mock).mockImplementation(() => ({}));
  });

  it('renders children', () => {
    const mockChildren = 'children';
    render(<ActiveToolProvider tool={mockTool}>{mockChildren}</ActiveToolProvider>);
    expect(screen.getByText(mockChildren)).toBeTruthy();
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

  it('updates tool if tool prop changes', () => {
    let tool: Tool = mockTool;
    const { result, rerender } = renderHook(() => useContext(ActiveToolContext), {
      wrapper: ({ children }: { children: ReactElement }) => (
        <ActiveToolProvider tool={tool}>{children}</ActiveToolProvider>
      ),
    });
    expect(result.current.tool).toEqual(tool);

    tool = { ...mockTool, name: 'Updated Tool!' };
    rerender();
    expect(result.current.tool).toEqual(tool);
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
      expect(result.current.evalDataValuesMap).toEqual(mockElementEvalDataValuesMap);
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
    const mockToolUpdate = { name: 'Updated Tool Name' };
    const mockSuccessResponse = {
      data: {
        ...mockTool,
        ...mockToolUpdate,
      },
    };

    it('returns result from update tool API', async () => {
      mockUpdateTool.mockImplementation(() => mockSuccessResponse);

      const { result } = renderHook(() => useContext(ActiveToolContext), {
        wrapper: ({ children }: { children: ReactElement }) => (
          <ActiveToolProvider tool={mockTool}>{children}</ActiveToolProvider>
        ),
      });

      await waitFor(async () => {
        const response = await result.current.updateTool(mockToolUpdate);

        expect(mockUpdateTool).toHaveBeenCalledWith({
          _id: mockTool._id,
          ...mockToolUpdate,
        });
        expect(response).toEqual(mockSuccessResponse);
      });
    });

    it('sets active tool as tool after successful update', async () => {
      mockUpdateTool.mockImplementation(() => mockSuccessResponse);

      const { result } = renderHook(() => useContext(ActiveToolContext), {
        wrapper: ({ children }: { children: ReactElement }) => (
          <ActiveToolProvider tool={mockTool}>{children}</ActiveToolProvider>
        ),
      });

      await waitFor(async () => {
        await result.current.updateTool(mockToolUpdate);
        expect(result.current.tool).toEqual(mockSuccessResponse.data);
      });
    });

    it('displays error snackbar if update fails', async () => {
      const mockApiError = {
        status: 400,
        data: {
          message: 'Error Message',
        },
      };
      mockUpdateTool.mockImplementation(() => ({ error: mockApiError }));

      const { result } = renderHook(() => useContext(ActiveToolContext), {
        wrapper: ({ children }: { children: ReactElement }) => (
          <ActiveToolProvider tool={mockTool}>{children}</ActiveToolProvider>
        ),
      });

      await waitFor(async () => {
        await result.current.updateTool(mockToolUpdate);
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(mockApiError.data.message, {
          variant: 'error',
        });
      });
    });
  });
});
