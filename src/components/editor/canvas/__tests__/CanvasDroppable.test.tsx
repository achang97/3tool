import { ComponentType, Tool } from '@app/types';
import { render } from '@tests/utils/renderWithContext';
import { CanvasDroppable } from '../CanvasDroppable';

const mockTool: Tool = {
  id: 'test',
  name: 'Tool',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  creator: {
    name: 'Andrew',
  },
  components: [
    {
      name: 'button1',
      type: ComponentType.Button,
      layout: {
        w: 1,
        h: 1,
        x: 1,
        y: 1,
      },
      metadata: {
        button: {
          basic: {
            text: 'Button 1',
          },
          interaction: {},
        },
      },
    },
  ],
};
const mockUpdateTool = jest.fn();

jest.mock('../../hooks/useGetActiveTool', () => ({
  useGetActiveTool: jest.fn(() => mockTool),
}));

jest.mock('../../hooks/useUpdateActiveTool', () => ({
  useUpdateActiveTool: jest.fn(() => mockUpdateTool),
}));

describe('CanvasDroppable', () => {
  it('renders tool components', () => {
    const result = render(<CanvasDroppable />);
    expect(
      result.container.querySelector(`#${mockTool.components[0].name}`)
    ).toBeDefined();
  });
});
