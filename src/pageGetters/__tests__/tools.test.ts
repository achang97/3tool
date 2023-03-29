import { endpoints, util } from '@app/redux/services/tools';
import { store } from '@app/redux/store';
import { mockTool } from '@tests/constants/data';
import { GetServerSidePropsContext } from 'next';
import { getServerSideProps } from '../tools';

const mockGetToolByIdInitiateResult = jest.fn();
const mockResetApiStateResult = jest.fn();
const dispatchSpy = jest.spyOn(store, 'dispatch');

jest.mock('@app/redux/services/tools', () => {
  const actualToolsServices = jest.requireActual('@app/redux/services/tools');

  return {
    ...actualToolsServices,
    __esModule: true,
    useGetToolByIdQuery: jest.fn(() => ({
      data: mockTool,
    })),
    endpoints: {
      getToolById: {
        initiate: jest.fn(() => mockGetToolByIdInitiateResult),
      },
    },
    util: {
      ...actualToolsServices.util,
      resetApiState: jest.fn(() => mockResetApiStateResult),
    },
  };
});

describe('tools', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getServerSideProps', () => {
    it('does not fetch tool if id is not a string', async () => {
      const mockId = [''];

      await getServerSideProps({
        params: { id: mockId },
      } as unknown as GetServerSidePropsContext);

      expect(dispatchSpy).not.toHaveBeenCalledWith(
        endpoints.getToolById.initiate(mockId as unknown as string)
      );
    });

    it('fetches tool and resets state if id is a string', async () => {
      const mockId = 'id';

      await getServerSideProps({
        params: { id: mockId },
      } as unknown as GetServerSidePropsContext);

      expect(endpoints.getToolById.initiate).toHaveBeenCalledWith(mockId);
      expect(dispatchSpy).toHaveBeenCalledWith(
        endpoints.getToolById.initiate(mockId)
      );

      expect(util.resetApiState).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(util.resetApiState());
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
