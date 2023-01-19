import { useAppSelector } from '@app/redux/hooks';
import { ComponentType, Tool } from '@app/types';
import { render } from '@tests/utils/renderWithContext';
import { Inspector } from '../Inspector';

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
      metadata: {},
    },
  ],
};

jest.mock('@app/redux/hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    query: { id: mockTool.id },
  })),
}));

jest.mock('@app/redux/services/tools', () => ({
  __esModule: true,
  ...jest.requireActual('@app/redux/services/tools'),
  useGetToolByIdQuery: jest.fn(() => ({
    data: mockTool,
  })),
}));

describe('Inspector', () => {
  it('renders component inspector if there is a focused component', () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      focusedComponentName: mockTool.components[0].name,
    }));

    const result = render(<Inspector />);
    expect(result.getByTestId('component-inspector')).toBeDefined();
  });

  it('renders tool inspector if there is no focused component', () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      focusedComponentName: undefined,
    }));

    const result = render(<Inspector />);
    expect(result.getByTestId('tool-inspector')).toBeDefined();
  });
});
