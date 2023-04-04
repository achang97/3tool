import { logout } from '@app/redux/actions/auth';
import { useAppDispatch } from '@app/redux/hooks';
import { useLogoutMutation } from '@app/redux/services/auth';
import { useCallback } from 'react';

export const useLogout = () => {
  const [callLogoutApi] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const handleLogout = useCallback(() => {
    callLogoutApi();
    dispatch(logout());
  }, [dispatch, callLogoutApi]);

  return handleLogout;
};
