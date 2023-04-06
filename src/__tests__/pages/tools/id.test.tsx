import { useQueryTool } from '@app/components/editor/hooks/useQueryTool';
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
    query: { id: mockTool._id },
  })),
}));

jest.mock('@app/components/editor/hooks/useQueryTool');

describe('Tools/Id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('page', () => {
    describe('loading', () => {
      it('renders fullscreen loader', () => {
        (useQueryTool as jest.Mock).mockImplementation(() => undefined);
        const result = render(<Tool />);
        expect(result.getByTestId('fullscreen-loader')).toBeTruthy();
      });
    });

    describe('fulfilled', () => {
      beforeEach(() => {
        (useQueryTool as jest.Mock).mockImplementation(() => mockTool);
      });

      it('renders tool viewer toolbar', () => {
        const result = render(<Tool />);
        expect(result.getByTestId('tool-viewer-toolbar')).toBeTruthy();
      });

      it('renders editor app', () => {
        const result = render(<Tool />);
        expect(result.getByTestId('editor-app')).toBeTruthy();
      });
    });
  });
});
