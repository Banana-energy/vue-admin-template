import { get } from '@/utils/request';

export function getUserResByMenuId(menuId) {
  return get({
    url: `/auth/menu/res/${menuId}`,
  });
}

export function getUserMenus() {
  return get({
    url: '/auth/menus'
  });
}
