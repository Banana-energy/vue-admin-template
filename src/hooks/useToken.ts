import { useCookies, } from "@vueuse/integrations/useCookies"

export const TOKEN_NAME = "jwt_token"

const state = useSessionStorage(TOKEN_NAME, "",)
const cookies = useCookies([TOKEN_NAME,],)

export function getToken() {
  return state.value
}

export function useToken() {
  return {
    getToken: () => {
      return state.value
    },
    setToken: (token: string,) => {
      state.value = token
      cookies.set(TOKEN_NAME, token,)
    },
    removeToken: () => {
      state.value = null
      cookies.remove(TOKEN_NAME,)
    },
  }
}
