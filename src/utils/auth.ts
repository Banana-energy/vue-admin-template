import Cookies from "js-cookie";
import env from "@/config/env.config";

const TokenKey = env.tokenKey;

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token: string) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
