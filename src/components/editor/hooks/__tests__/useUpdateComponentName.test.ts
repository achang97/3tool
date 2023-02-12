import { COMPONENT_DATA_TEMPLATES } from '@app/constants';
import { renameComponentInput } from '@app/redux/features/activeToolSlice';
import {
  focusComponent,
  setSnackbarMessage,
} from '@app/redux/features/editorSlice';
import { Component, ComponentType, Tool } from '@app/types';
import { renderHook } from '@testing-library/react';
import {
  mockApiErrorResponse,
  mockApiSuccessResponse,
} from '@tests/constants/api';
import {
  mockComponentLayout,
  mockTool as baseMockTool,
} from '@tests/constants/data';
import _ from 'lodash';
import { useUpdateComponentName } from '../useUpdateComponentName';

const mockName = 'button1';
const mockNewName = 'newButton';

const mockComponents: Component[] = [
  {
    type: ComponentType.Button,
    name: 'button1',
    layout: mockComponentLayout,
    data: {
      button: {
        ...COMPONENT_DATA_TEMPLATES[ComponentType.Button],
        text: '{{ button1.disabled }}',
      },
    },
  },
  {
    type: ComponentType.Button,
    name: 'button2',
    layout: mockComponentLayout,
    data: {
      button: {
        ...COMPONENT_DATA_TEMPLATES[ComponentType.Button],
        text: '{{ button1.text + "button1.text" }} + button1.text',
      },
    },
  },
];
const mockTool: Tool = {
  ...baseMockTool,
  components: mockComponents,
};

const mockDispatch = jest.fn();
const mockUpdateTool = jest.fn();

jest.mock('../useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: mockTool,
    updateTool: mockUpdateTool,
  })),
}));

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

describe('useUpdateComponentName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validation', () => {
    it('displays error snackbar if new name does not match regex', async () => {
      const { result } = renderHook(() => useUpdateComponentName(mockName));
      await result.current('new-name!');

      expect(mockDispatch).toHaveBeenCalledWith(
        setSnackbarMessage({
          type: 'error',
          message: 'Name can only contain letters, numbers, _, or $',
        })
      );
    });
  });

  describe('API call', () => {
    it('updates name of current component', async () => {
      const { result } = renderHook(() => useUpdateComponentName(mockName));
      await result.current(mockNewName);

      expect(mockUpdateTool).toHaveBeenCalled();
      expect(mockUpdateTool.mock.calls[0][0].components[0]).toMatchObject({
        name: mockNewName,
      });
    });

    it('updates references of current component in dynamic fields', async () => {
      const { result } = renderHook(() => useUpdateComponentName(mockName));
      await result.current(mockNewName);

      expect(mockUpdateTool).toHaveBeenCalledWith({
        components: [
          _.merge({}, mockComponents[0], {
            name: mockNewName,
            data: {
              button: {
                text: `{{ ${mockNewName}.disabled }}`,
              },
            },
          }),
          _.merge({}, mockComponents[1], {
            data: {
              button: {
                text: `{{ ${mockNewName}.text + "button1.text" }} + button1.text`,
              },
            },
          }),
        ],
      });
    });
  });

  describe('side effects', () => {
    describe('error', () => {
      beforeEach(() => {
        mockUpdateTool.mockImplementation(() => mockApiErrorResponse);
      });

      it('does not focus compoment or rename component inputs if API call fails', async () => {
        const { result } = renderHook(() => useUpdateComponentName(mockName));
        await result.current(mockNewName);

        expect(mockDispatch).not.toHaveBeenCalled();
      });
    });

    describe('success', () => {
      beforeEach(() => {
        mockUpdateTool.mockImplementation(() => mockApiSuccessResponse);
      });

      it('focuses component with new name if API call succeeds', async () => {
        const { result } = renderHook(() => useUpdateComponentName(mockName));
        await result.current(mockNewName);

        expect(mockDispatch).toHaveBeenCalledWith(focusComponent(mockNewName));
      });

      it('renames component inputs with new name if API call succeeds', async () => {
        const { result } = renderHook(() => useUpdateComponentName(mockName));
        await result.current(mockNewName);

        expect(mockDispatch).toHaveBeenCalledWith(
          renameComponentInput({ prevName: mockName, newName: mockNewName })
        );
      });
    });
  });
});
