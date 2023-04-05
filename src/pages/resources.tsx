import Head from 'next/head';
import { Box } from '@mui/material';
import { createTitle } from '@app/utils/window';
import { PageTitle } from '@app/components/common/PageTitle';
import { PageContainer } from '@app/components/common/PageContainer';
import { ResourceDataGrid } from '@app/components/resources/ResourceDataGrid';
import { CreateResourceButton } from '@app/components/resources/CreateResourceButton';
import { ResourceModals } from '@app/components/resources/ResourceModals';

const Resources = () => {
  return (
    <>
      <Head>
        <title>{createTitle('Resource Library')}</title>
      </Head>
      <main>
        <PageContainer>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 1,
            }}
          >
            <PageTitle showPadding={false}>Resource Library</PageTitle>
            <CreateResourceButton />
          </Box>
          <ResourceDataGrid />
          <ResourceModals />
        </PageContainer>
      </main>
    </>
  );
};

export default Resources;
