import { get, postJSON } from "@/utils/request";

export function logout() {
  return postJSON({
    url: "/common/sso/client/logout",
  });
}

export function getUserInfo() {
  return get({
    url: "/common/sso/client/user",
    data: {},
  });
}
