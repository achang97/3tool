import { setSnackbarMessage } from '@app/redux/features/editorSlice';
import { useUpdateToolMutation } from '@app/redux/services/tools';
import { ApiError } from '@app/types';
import { renderHook } from '@testing-library/react';
import { mockTool } from '@tests/constants/data';
import { DepGraph } from 'dependency-graph';
import { ReactElement, useContext } from 'react';
import {
  ComponentEvalDataMap,
  ComponentEvalDataValuesMap,
  useComponentEvalDataMaps,
} from '../../hooks/useComponentEvalDataMaps';
import { ActiveToolContext, ActiveToolProvider } from '../ActiveToolContext';

const mockDispatch = jest.fn();
const mockUpdateTool = jest.fn();

const mockComponentDataDepGraph = new DepGraph<string>();
mockComponentDataDepGraph.addNode('button1');
mockComponentDataDepGraph.addNode('button2');
mockComponentDataDepGraph.addDependency('button1', 'button2');

const mockComponentEvalDataMap: ComponentEvalDataMap = {
  button1: {
    text: {
      parsedExpression: 'hello',
      value: 'hello',
    },
  },
};
const mockComponentEvalDataValuesMap: ComponentEvalDataValuesMap = {
  button1: {
    text: 'hello',
  },
};

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

jest.mock('../../hooks/useComponentDataDepGraph', () => ({
  useComponentDataDepGraph: jest.fn(() => mockComponentDataDepGraph),
}));

jest.mock('../../hooks/useComponentEvalDataMaps');

jest.mock('@app/redux/services/tools');

describe('ActiveToolContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useUpdateToolMutation as jest.Mock).mockImplementation(() => [
      mockUpdateTool,
      {},
    ]);
    (useComponentEvalDataMaps as jest.Mock).mockImplementation(() => ({
      componentEvalDataMap: mockComponentEvalDataMap,
      componentEvalDataValuesMap: mockComponentEvalDataValuesMap,
    }));

    mockUpdateTool.mockClear();
  });

  it('returns default state', () => {
    const { result } = renderHook(() => useContext(ActiveToolContext));
    expect(result.current).toEqual({
      tool: {},
      updateTool: expect.any(Function),
      componentDataDepGraph: {
        nodes: {},
        outgoingEdges: {},
        incomingEdges: {},
        circular: undefined,
      },
      componentEvalDataMap: {},
      componentEvalDataValuesMap: {},
    });
  });

  it('returns componentDataDepGraph', () => {
    const { result } = renderHook(() => useContext(ActiveToolContext), {
      wrapper: ({ children }: { children: ReactElement }) => (
        <ActiveToolProvider tool={mockTool}>{children}</ActiveToolProvider>
      ),
    });
    expect(result.current.componentDataDepGraph).toEqual(
      mockComponentDataDepGraph
    );
  });

  it('returns componentEvalDataMap', () => {
    const { result } = renderHook(() => useContext(ActiveToolContext), {
      wrapper: ({ children }: { children: ReactElement }) => (
        <ActiveToolProvider tool={mockTool}>{children}</ActiveToolProvider>
      ),
    });
    expect(result.current.componentEvalDataMap).toEqual(
      mockComponentEvalDataMap
    );
  });

  it('returns componentEvalDataValuesMap', () => {
    const { result } = renderHook(() => useContext(ActiveToolContext), {
      wrapper: ({ children }: { children: ReactElement }) => (
        <ActiveToolProvider tool={mockTool}>{children}</ActiveToolProvider>
      ),
    });
    expect(result.current.componentEvalDataValuesMap).toEqual(
      mockComponentEvalDataValuesMap
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

      expect(mockDispatch).not.toHaveBeenCalled();
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

      expect(mockDispatch).toHaveBeenCalledWith(
        setSnackbarMessage({
          type: 'error',
          message: mockApiError.data!.message,
        })
      );
    });

    it('does not display error snackbar if evaluation succeeds', () => {
      (useComponentEvalDataMaps as jest.Mock).mockImplementation(() => ({
        error: undefined,
      }));

      renderHook(() => useContext(ActiveToolContext), {
        wrapper: ({ children }: { children: ReactElement }) => (
          <ActiveToolProvider tool={mockTool}>{children}</ActiveToolProvider>
        ),
      });

      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('displays error snackbar if evaluation fails', () => {
      const mockErrorMessage = 'Error Message';
      (useComponentEvalDataMaps as jest.Mock).mockImplementation(() => ({
        error: new Error(mockErrorMessage),
      }));

      renderHook(() => useContext(ActiveToolContext), {
        wrapper: ({ children }: { children: ReactElement }) => (
          <ActiveToolProvider tool={mockTool}>{children}</ActiveToolProvider>
        ),
      });

      expect(mockDispatch).toHaveBeenCalledWith(
        setSnackbarMessage({
          type: 'error',
          message: mockErrorMessage,
        })
      );
    });
  });
});
