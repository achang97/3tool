import Editor from '@app/pages/editor/[id]';
import { mockTool } from '@tests/constants/data';
import { render } from '@tests/utils/renderWithContext';

jest.mock('@app/redux/services/tools', () => ({
  ...jest.requireActual('@app/redux/services/tools'),
  __esModule: true,
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('page', () => {
    it('renders tool editor toolbar', () => {
      const result = render(<Editor tool={mockTool} />);
      expect(result.getByTestId('tool-editor-toolbar')).toBeTruthy();
    });

    it('renders editor', () => {
      const result = render(<Editor tool={mockTool} />);
      expect(result.getByTestId('editor')).toBeTruthy();
    });
  });
});
