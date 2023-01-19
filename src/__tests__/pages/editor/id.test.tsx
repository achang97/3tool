import Editor from '@app/pages/editor/[id]';
import { ComponentType, Tool } from '@app/types';
import userEvent from '@testing-library/user-event';
import { render } from '@tests/utils/renderWithContext';

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

jest.mock('@app/redux/services/tools', () => ({
  __esModule: true,
  ...jest.requireActual('@app/redux/services/tools'),
  useGetToolByIdQuery: jest.fn(() => ({
    data: mockTool,
  })),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    query: { id: mockTool.id },
  })),
}));

describe('Editor/Id', () => {
  it('renders editor sidebar', async () => {
    const result = render(<Editor />);

    // Default view should be the component picker
    expect(await result.findByTestId('component-picker')).toBeDefined();

    await userEvent.click(result.getByText('Inspector'));
    expect(await result.findByTestId('inspector')).toBeDefined();

    await userEvent.click(result.getByText('Components'));
    expect(await result.findByTestId('component-picker')).toBeDefined();
  });

  it('renders editor canvas and components', async () => {
    const result = render(<Editor />);

    expect(await result.findByTestId('editor-canvas')).toBeDefined();
    expect(result.container.querySelector(`#${mockTool.components[0].name}`));
  });
});
