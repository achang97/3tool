import { ComponentType, Tool } from '@app/types';
import { render } from '@tests/utils/renderWithContext';
import userEvent from '@testing-library/user-event';
import {
  blurComponentFocus,
  focusToolSettings,
} from '@app/redux/features/editorSlice';
import { EditorCanvas } from '../EditorCanvas';

const mockDispatch = jest.fn();
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

jest.mock('@app/redux/hooks', () => ({
  ...jest.requireActual('@app/redux/hooks'),
  useAppDispatch: jest.fn(() => mockDispatch),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    query: { id: mockTool.id },
  })),
}));

describe('EditorCanvas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('blurs component focus on canvas click', async () => {
    const result = render(<EditorCanvas />);

    await userEvent.click(result.getByTestId('editor-canvas'));
    expect(mockDispatch).toHaveBeenCalledWith(blurComponentFocus());
  });

  it('focuses tool settings on tool text click', async () => {
    const result = render(<EditorCanvas />);

    await userEvent.click(result.getByText('tool'));
    expect(mockDispatch).toHaveBeenCalledWith(focusToolSettings());
    expect(mockDispatch).not.toHaveBeenCalledWith(blurComponentFocus());
  });

  it('renders components', async () => {
    const result = render(<EditorCanvas />);

    expect(
      result.container.querySelector(`#${mockTool.components[0].name}`)
    ).toBeDefined();

    // NOTE: We ideally should test focus behavior here, but there is a known bug where onDragStart
    // is called before onDragEnd in react-grid-layout: https://github.com/react-grid-layout/react-grid-layout/issues/1401
  });

  it('renders canvas toolbar', () => {
    const result = render(<EditorCanvas />);
    expect(result.getByTestId('canvas-toolbar')).toBeDefined();
  });

  it('renders droppable canvas', () => {
    const result = render(<EditorCanvas />);
    expect(result.getByTestId('canvas-droppable')).toBeDefined();
  });
});
