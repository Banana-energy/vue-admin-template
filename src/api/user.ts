import { postJSON } from "@/utils/request";

export interface IReqLogin {
  username?: string;
  password?: string;
}

export interface IResLogin {
  data?: string | null;
}

export function login(data: IReqLogin) {
  return postJSON<IResLogin>({
    url: "/api/app/users/login",
    data,
  });
}
