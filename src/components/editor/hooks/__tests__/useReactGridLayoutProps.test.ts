import { COMPONENT_CONFIGS } from '@app/constants';
import {
  endCreateComponentDrag,
  endMoveComponentDrag,
  focusComponent,
  startMoveComponentDrag,
} from '@app/redux/features/editorSlice';
import { useAppSelector } from '@app/redux/hooks';
import { Component, ComponentType } from '@app/types';
import { renderHook } from '@testing-library/react';
import {
  mockApiErrorResponse,
  mockApiSuccessResponse,
} from '@tests/constants/api';
import { mockComponentLayout } from '@tests/constants/data';
import { Layout } from 'react-grid-layout';
import { createNewComponent } from '../../utils/components';
import { useReactGridLayoutProps } from '../useReactGridLayoutProps';

const mockComponents: Component[] = [
  {
    name: 'button1',
    type: ComponentType.Button,
    layout: mockComponentLayout,
    eventHandlers: [],
    data: {},
  },
];

const mockUpdateTool = jest.fn();

const mockLayout: Layout = {
  i: 'button1',
  w: 1,
  h: 2,
  x: 3,
  y: 4,
};
const mockNewComponent = {
  type: ComponentType.Button,
  name: 'name',
};

const mockDispatch = jest.fn();

jest.mock('@app/redux/hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(() => mockDispatch),
}));

jest.mock('../useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: {
      components: mockComponents,
    },
    updateTool: mockUpdateTool,
  })),
}));

describe('useReactGridLayoutProps', () => {
  const getLayoutFromComponents = (components: Component[]): Layout[] => {
    return components.map((component) => ({
      ...component.layout,
      i: component.name,
    }));
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation(() => ({}));
    mockUpdateTool.mockReset();
  });

  describe('layout', () => {
    it('returns layout object from components', () => {
      const { result } = renderHook(() => useReactGridLayoutProps());

      expect(result.current.layout).toEqual([
        {
          i: 'button1',
          w: mockComponentLayout.w,
          h: mockComponentLayout.h,
          x: mockComponentLayout.x,
          y: mockComponentLayout.y,
        },
      ]);
    });
  });

  describe('droppingItem', () => {
    it('returns undefined if not creating new component', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        newComponent: undefined,
      }));

      const { result } = renderHook(() => useReactGridLayoutProps());

      expect(result.current.droppingItem).toBeUndefined();
    });

    it('returns object with i as component name', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        newComponent: mockNewComponent,
      }));

      const { result } = renderHook(() => useReactGridLayoutProps());

      expect(result.current.droppingItem?.i).toEqual(mockNewComponent.name);
    });

    it('returns object with correct dimensions', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        newComponent: {
          type: ComponentType.Button,
          name: 'name',
        },
      }));

      const { result } = renderHook(() => useReactGridLayoutProps());

      expect(result.current.droppingItem).toMatchObject(
        COMPONENT_CONFIGS.button.dimensions
      );
    });
  });

  describe('onDrag', () => {
    it('does nothing if creating new component', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        newComponent: mockNewComponent,
      }));

      const { result } = renderHook(() => useReactGridLayoutProps());

      result.current.onDrag([], {} as Layout, mockLayout);
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('does nothing if moving component', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        movingComponentName: 'name',
      }));

      const { result } = renderHook(() => useReactGridLayoutProps());

      result.current.onDrag([], {} as Layout, mockLayout);
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('dispatches actions to start move drag and focus component', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        newComponent: undefined,
        movingComponentName: undefined,
      }));

      const { result } = renderHook(() => useReactGridLayoutProps());

      result.current.onDrag([], {} as Layout, mockLayout);
      expect(mockDispatch).toHaveBeenCalledWith(
        startMoveComponentDrag(mockLayout.i)
      );
      expect(mockDispatch).toHaveBeenCalledWith(focusComponent(mockLayout.i));
    });
  });

  describe('onDragStop', () => {
    it('dispatches action to end move drag', () => {
      const { result } = renderHook(() => useReactGridLayoutProps());

      result.current.onDragStop();
      expect(mockDispatch).toHaveBeenCalledWith(endMoveComponentDrag());
    });
  });

  describe('onDrop', () => {
    it('does nothing if not creating new component', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        newComponent: undefined,
      }));

      const { result } = renderHook(() => useReactGridLayoutProps());

      result.current.onDrop([]);
      expect(mockUpdateTool).not.toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('dispatches action to end component drag', async () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        newComponent: mockNewComponent,
      }));

      const { result } = renderHook(() => useReactGridLayoutProps());

      await result.current.onDrop([mockLayout]);
      expect(mockDispatch).toHaveBeenCalledWith(endCreateComponentDrag());
    });

    it('calls onUpdateComponents with new component and focuses component on success', async () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        newComponent: mockNewComponent,
      }));
      mockUpdateTool.mockImplementation(() => mockApiSuccessResponse);

      const { result } = renderHook(() => useReactGridLayoutProps());

      await result.current.onDrop([
        ...getLayoutFromComponents(mockComponents),
        mockLayout,
      ]);

      expect(mockUpdateTool).toHaveBeenCalledWith({
        components: [
          ...mockComponents,
          createNewComponent(
            mockNewComponent.type,
            mockNewComponent.name,
            mockLayout
          ),
        ],
      });
      expect(mockDispatch).toHaveBeenCalledWith(
        focusComponent(mockNewComponent.name)
      );
    });

    it('calls onUpdateComponents with new component and does not focus component on failure', async () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        newComponent: mockNewComponent,
      }));
      mockUpdateTool.mockImplementation(() => mockApiErrorResponse);

      const { result } = renderHook(() => useReactGridLayoutProps());

      await result.current.onDrop([
        ...getLayoutFromComponents(mockComponents),
        mockLayout,
      ]);
      expect(mockUpdateTool).toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalledWith(
        focusComponent(mockNewComponent.name)
      );
    });
  });

  describe('onLayoutChange', () => {
    it('does nothing if creating new component', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        newComponent: mockNewComponent,
      }));

      const { result } = renderHook(() => useReactGridLayoutProps());

      result.current.onLayoutChange([]);
      expect(mockUpdateTool).not.toHaveBeenCalled();
    });

    it('does nothing if new layout is a different length', () => {
      const { result } = renderHook(() => useReactGridLayoutProps());

      result.current.onLayoutChange([]);
      expect(mockUpdateTool).not.toHaveBeenCalled();
    });

    it('does nothing if new layout has different IDs', () => {
      const { result } = renderHook(() => useReactGridLayoutProps());

      const mockNewLayout = getLayoutFromComponents(mockComponents);
      mockNewLayout[0].i = 'some-new-id';
      result.current.onLayoutChange(mockNewLayout);

      expect(mockUpdateTool).not.toHaveBeenCalled();
    });

    it('does nothing if layout dimensions have not changed', () => {
      const { result } = renderHook(() => useReactGridLayoutProps());

      const mockNewLayout = getLayoutFromComponents(mockComponents);
      result.current.onLayoutChange(mockNewLayout);

      expect(mockUpdateTool).not.toHaveBeenCalled();
    });

    it('calls onUpdateComponents with new layout', () => {
      const { result } = renderHook(() => useReactGridLayoutProps());

      const mockNewLayout = getLayoutFromComponents(mockComponents);
      mockNewLayout[0].h = 1000;
      result.current.onLayoutChange(mockNewLayout);

      const newComponents = JSON.parse(JSON.stringify(mockComponents));
      newComponents[0].layout.h = 1000;
      expect(mockUpdateTool).toHaveBeenCalledWith({
        components: newComponents,
      });
    });
  });
});
