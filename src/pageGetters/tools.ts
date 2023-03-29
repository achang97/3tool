import { endpoints, util } from '@app/redux/services/tools';
import { wrapper } from '@app/redux/store';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async (context) => {
    const id = context.params?.id;
    if (typeof id === 'string') {
      store.dispatch(endpoints.getToolById.initiate(id));
    }

    const [result] = await Promise.all(
      store.dispatch(util.getRunningQueriesThunk())
    );
    store.dispatch(util.resetApiState());

    if (!result || result.isError) {
      return { notFound: true };
    }

    return {
      props: { tool: result.data },
    };
  });
