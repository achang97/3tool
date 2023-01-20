import Editor, { getServerSideProps } from '@app/pages/editor/[id]';
import { getToolById } from '@app/redux/services/tools';
import { store } from '@app/redux/store';
import { ComponentType, Tool } from '@app/types';
import userEvent from '@testing-library/user-event';
import { render } from '@tests/utils/renderWithContext';
import { GetServerSidePropsContext } from 'next';

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
