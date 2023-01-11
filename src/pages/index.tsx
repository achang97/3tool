import Head from 'next/head';
import { Grid } from '@mui/material';
import { getTitle } from '@app/utils/window';
import { useGetToolsQuery } from '@app/redux/services/tools';
import { ToolThumbnail } from '@app/components/tools/ToolThumbnail';
import { CreateToolThumbnail } from '@app/components/tools/CreateToolThumbnail';
import { PageTitle } from '@app/components/common/PageTitle';
import { PageContainer } from '@app/components/common/PageContainer';

const Tools = () => {
  const { data: tools } = useGetToolsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  return (
    <>
      <Head>
        <title>{getTitle('Tools')}</title>
      </Head>
      <main>
        <PageContainer>
          <PageTitle>Tools</PageTitle>
          <Grid container spacing={4}>
            <CreateToolThumbnail />
            {tools?.map((tool) => (
              <ToolThumbnail
                key={tool.id}
                id={tool.id}
                name={tool.name}
                updatedAt={tool.updatedAt}
                creator={tool.creator}
              />
            ))}
          </Grid>
        </PageContainer>
      </main>
    </>
  );
};

export default Tools;
