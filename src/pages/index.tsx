import Head from 'next/head';
import { Box } from '@mui/material';
import { getTitle } from '@app/utils/window';
import { useGetToolsQuery } from '@app/redux/services/tools';
import { ToolThumbnail } from '@app/components/tools/ToolThumbnail';
import { CreateToolThumbnail } from '@app/components/tools/CreateToolThumbnail';

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
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          <CreateToolThumbnail />
          {tools?.map((tool) => (
            <ToolThumbnail
              key={tool.id}
              id={tool.id}
              name={tool.name}
              updatedAt={tool.updatedAt}
            />
          ))}
        </Box>
      </main>
    </>
  );
};

export default Tools;
