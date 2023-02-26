import Editor, { getServerSideProps } from '@app/pages/editor/[id]';
import { getToolById } from '@app/redux/services/tools';
import { store } from '@app/redux/store';
import { mockTool } from '@tests/constants/data';
import { render } from '@tests/utils/renderWithContext';
import { GetServerSidePropsContext } from 'next';

const mockGetToolByIdInitiateResult = jest.fn();
const actualDispatch = store.dispatch;
const dispatchSpy = jest.spyOn(store, 'dispatch');

jest.mock('@app/redux/services/tools', () => ({
  ...jest.requireActual('@app/redux/services/tools'),
  __esModule: true,
  useGetToolByIdQuery: jest.fn(() => ({
    data: mockTool,
  })),
  getToolById: {
    initiate: jest.fn(() => mockGetToolByIdInitiateResult),
  },
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    query: { id: mockTool.id },
  })),
}));

describe('Editor/Id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    dispatchSpy.mockImplementation(actualDispatch);
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

  describe('getServerSideProps', () => {
    it('does not fetch tool if id is not a string', async () => {
      const mockId = [''];

      await getServerSideProps({
        params: { id: mockId },
      } as unknown as GetServerSidePropsContext);

      expect(dispatchSpy).not.toHaveBeenCalledWith(
        getToolById.initiate(mockId as unknown as string)
      );
    });

    it('fetches tool if id is a string', async () => {
      const mockId = 'id';

      await getServerSideProps({
        params: { id: mockId },
      } as unknown as GetServerSidePropsContext);

      expect(getToolById.initiate).toHaveBeenCalledWith(mockId);
      expect(dispatchSpy).toHaveBeenCalledWith(getToolById.initiate(mockId));
    });

    it('returns notFound as true if there are no queries', async () => {
      dispatchSpy.mockImplementation(() => []);
      const mockId = 'id';

      const result = await getServerSideProps({
        params: { id: mockId },
      } as unknown as GetServerSidePropsContext);

      // @ts-ignore notFound is defined
      expect(result.notFound).toEqual(true);
    });

    it('returns notFound as true if the query results in an error', async () => {
      dispatchSpy.mockImplementation(() => [
        new Promise((resolve) => {
          resolve({ isError: true });
        }),
      ]);
      const mockId = 'id';

      const result = await getServerSideProps({
        params: { id: mockId },
      } as unknown as GetServerSidePropsContext);

      // @ts-ignore notFound is defined
      expect(result.notFound).toEqual(true);
    });

    it('returns notFound as undefined if query is successful', async () => {
      dispatchSpy.mockImplementation(() => [
        new Promise((resolve) => {
          resolve({ isError: false });
        }),
      ]);
      const mockId = 'id';

      const result = await getServerSideProps({
        params: { id: mockId },
      } as unknown as GetServerSidePropsContext);

      // @ts-ignore props is defined
      expect(result.notFound).toBeUndefined();
    });
  });
});
