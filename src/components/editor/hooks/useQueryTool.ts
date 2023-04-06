import { useGetToolByIdQuery } from '@app/redux/services/tools';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';

export const useQueryTool = () => {
  const { query, push } = useRouter();

  const toolId = useMemo(() => {
    return query.id?.toString() ?? '';
  }, [query.id]);

  const { data: tool, error } = useGetToolByIdQuery(toolId, {
    skip: !toolId,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (error) {
      push('/404');
    }
  }, [error, push, toolId]);

  return tool;
};
