import { useGetToolByIdQuery } from '@app/redux/services/tools';
import { Tool } from '@app/types';
import { useRouter } from 'next/router';

export const useGetActiveTool = (): Tool | undefined => {
  const {
    query: { id },
  } = useRouter();

  const result = useGetToolByIdQuery(id as string);

  return result.data;
};
