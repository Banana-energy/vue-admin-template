import config from "@/config/env.config";

const TokenKey = config.tokenKey;
const token = useLocalStorage(TokenKey, "");
export const useToken = () => {
  const getToken = () => token.value;
  const setToken = (value: string) => {
    token.value = value;
  };
  const removeToken = () => {
    token.value = null;
  };
  return {
    getToken,
    setToken,
    removeToken,
  };
};
