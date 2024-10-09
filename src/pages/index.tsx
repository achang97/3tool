import Head from 'next/head';
import { Grid, Stack } from '@mui/material';
import { createTitle } from '@app/utils/window';
import { useGetToolsQuery } from '@app/redux/services/tools';
import { ToolThumbnail } from '@app/components/tools/ToolThumbnail';
import { CreateToolThumbnail } from '@app/components/tools/CreateToolThumbnail';
import { PageTitle } from '@app/components/common/PageTitle';
import { PageContainer } from '@app/components/common/PageContainer';
import { FullscreenLoader } from '@app/components/common/FullscreenLoader';
import { ApiErrorMessage } from '@app/components/common/ApiErrorMessage';

const Tools = () => {
  const {
    data: tools,
    isLoading,
    error,
  } = useGetToolsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  return (
    <>
      <Head>
        <title>{createTitle('Apps')}</title>
      </Head>
      <main>
        <PageContainer>
          <PageTitle>Apps</PageTitle>
          {isLoading && <FullscreenLoader />}
          {!isLoading && !!error && (
            <Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ApiErrorMessage error={error} />
            </Stack>
          )}
          {!isLoading && !error && (
            <Grid container spacing={4}>
              <CreateToolThumbnail />
              {tools?.map((tool) => (
                <ToolThumbnail
                  key={tool._id}
                  id={tool._id}
                  name={tool.name}
                  updatedAt={tool.updatedAt}
                />
              ))}
            </Grid>
          )}
        </PageContainer>
      </main>
    </>
  );
};

export default Tools;
