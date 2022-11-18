import { get, postJSON } from "@/utils/request";

export function login(data) {
  return postJSON({
    url: "/user/login",
    data,
  });
}

export function logout() {
  return postJSON({
    url: "/user/logout",
  });
}

export function getUserInfo(token) {
  return get({
    url: "/user/info",
    params: token,
  });
}
