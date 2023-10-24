import { get, postJSON } from '@/utils/request';

export function logout() {
  return postJSON({
    url: '/sso/client/logout',
  });
}

export function getUserInfo() {
  return get({
    url: '/sso/user',
  });
}
