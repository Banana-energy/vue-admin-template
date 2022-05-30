import { get, postJSON } from "@/utils/request";

export interface IReqLogin {
  username?: string;
  password?: string;
}

export interface IResLogin {
  data?: string | null;
}

export function login(data: IReqLogin) {
  return postJSON<IResLogin>({
    url: "/user/login",
    data,
  });
}

export interface IResLogout {
  data?: string | null;
}

export function logout() {
  return postJSON<IResLogout>({
    url: "/user/logout",
  });
}

export interface IReqUserInfo {
  token: string;
}

export interface IResUserInfo {
  roles?: string[] | null;
}

export function getUserInfo(token: IReqUserInfo) {
  return get<IResUserInfo>({
    url: "/user/info",
    params: {
      token,
    },
  });
}
