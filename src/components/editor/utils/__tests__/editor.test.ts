import { Component, ComponentType } from '@app/types';
import { Layout } from 'react-grid-layout';
import { createNewComponent, getNewComponentName } from '../editor';

describe('editor', () => {
  const createMockComponentList = (names: string[]): Component[] => {
    return names.map((name) => ({ name } as Component));
  };

  describe('getNewComponentId', () => {
    it('returns id with suffix of 1 if there are no ids with the same component type', () => {
      const result = getNewComponentName(
        ComponentType.Button,
        createMockComponentList([
          `${ComponentType.Text}1`,
          `${ComponentType.Text}2`,
          `${ComponentType.TextInput}2`,
          `${ComponentType.Button}`,
        ])
      );
      expect(result).toEqual(`${ComponentType.Button}1`);
    });

    it('returns id with suffix of the max id with the same component type + 1', () => {
      const result = getNewComponentName(
        ComponentType.Button,
        createMockComponentList([
          `${ComponentType.Text}1`,
          `${ComponentType.Text}2`,
          `${ComponentType.Button}2`,
          `${ComponentType.Button}3`,
        ])
      );
      expect(result).toEqual(`${ComponentType.Button}4`);
    });
  });

  describe('createNewComponent', () => {
    const mockName = 'Component Name';
    const mockLayout: Layout = {
      w: 1,
      h: 1,
      x: 1,
      y: 1,
      i: '1',
      isDraggable: false,
      isResizable: true,
    };

    it('creates component with parsed layout', () => {
      const mockType = ComponentType.Button;

      const result = createNewComponent(mockType, mockName, mockLayout);
      expect(result).toEqual({
        type: mockType,
        name: mockName,
        layout: {
          w: 1,
          h: 1,
          x: 1,
          y: 1,
        },
        metadata: expect.any(Object),
      });
    });

    it('button: creates component with default button metadata', () => {
      const result = createNewComponent(
        ComponentType.Button,
        mockName,
        mockLayout
      );
      expect(result.metadata).toEqual({
        button: {
          basic: {
            text: 'Button',
          },
          interaction: {},
        },
      });
    });
  });
});
