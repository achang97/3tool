import { COMPONENT_DATA_TEMPLATES } from '@app/constants';
import { ComponentType } from '@app/types';
import { Layout } from 'react-grid-layout';
import { createNewComponent } from '../components';

describe('editor', () => {
  describe('createNewComponent', () => {
    const mockName = 'Component Name';
    const mockLayout: Layout = {
      w: 1,
      h: 2,
      x: 3,
      y: 4,
      i: '1',
      isDraggable: false,
      isResizable: true,
    };

    it('creates component with parsed layout and template data', () => {
      const mockType = ComponentType.Button;

      const result = createNewComponent(mockType, mockName, mockLayout);
      expect(result).toEqual({
        type: mockType,
        name: mockName,
        layout: {
          w: mockLayout.w,
          h: mockLayout.h,
          x: mockLayout.x,
          y: mockLayout.y,
        },
        data: {
          [mockType]: COMPONENT_DATA_TEMPLATES[mockType],
        },
        eventHandlers: [],
      });
    });
  });
});
