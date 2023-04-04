import { useAppSelector } from '@app/redux/hooks';
import { User } from '@app/types';

export const useUser = (): User | undefined => {
  const { user } = useAppSelector((state) => state.auth);
  return user;
};
