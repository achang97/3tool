import { useAppSelector } from '@app/redux/hooks';
import { User } from '@app/types';

export const useSignedInUser = (): User | undefined => {
  const { user } = useAppSelector((state) => state.auth);
  return user;
};
