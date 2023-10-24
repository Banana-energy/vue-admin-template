import config from '@/constants/env.config';

const TokenKey = config.tokenName;
const token = useLocalStorage(TokenKey, '');
export const useToken = () => {
  const getToken = () => token.value;
  const setToken = (value) => {
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
