import type { UserInfoAPI, } from "@/apis/userInfo"
import { fetchUserInfo, } from "@/apis/userInfo"
import { defineStore, } from "pinia"

export const useUserStore = defineStore("userInfo", {
  state: (): UserInfoAPI.UserInfo => {
    return {
      userId: "",
      name: "",
      avatarUrl: "",
      email: "",
    }
  },
  actions: {
    async getUserInfo() {
      const result = await fetchUserInfo()
      if (result && result.datas) {
        this.$state = result.datas
        return true
      }
      return false
    },
    logoutConfirm() {
    },
  },
},)
