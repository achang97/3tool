import Tool from '@app/pages/tools/[id]';
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

describe('Tools/Id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('page', () => {
    it('renders tool viewer toolbar', () => {
      const result = render(<Tool tool={mockTool} />);
      expect(result.getByTestId('tool-viewer-toolbar')).toBeTruthy();
    });

    it('renders editor app', () => {
      const result = render(<Tool tool={mockTool} />);
      expect(result.getByTestId('editor-app')).toBeTruthy();
    });
  });
});
