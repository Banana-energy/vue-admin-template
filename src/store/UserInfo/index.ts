import type { UserInfoAPI, } from "@/apis/userInfo"
import { fetchUserInfo, logout, } from "@/apis/userInfo"
import { useToken, } from "@/hooks/useToken.ts"
import { defineStore, } from "pinia"

export const useUserStore = defineStore("userInfo", {
  state: (): UserInfoAPI.UserInfo => {
    return {
      id: undefined,
      uid: "",
      name: "",
      fullName: "",
      email: "",
      mobileCountryCode: "",
      mobile: "",
      gender: undefined,
      avatar: "",
      employeeNo: "",
      employeeType: undefined,
      status: undefined,
      leaderUserId: undefined,
      leaderUserUid: "",
      city: "",
      jobTitle: "",
      source: "",
      depts: [],
    }
  },
  actions: {
    reset() {
      this.$state = {
        id: undefined,
        uid: "",
        name: "",
        fullName: "",
        email: "",
        mobileCountryCode: "",
        mobile: "",
        gender: undefined,
        avatar: "",
        employeeNo: "",
        employeeType: undefined,
        status: undefined,
        leaderUserId: undefined,
        leaderUserUid: "",
        city: "",
        jobTitle: "",
        source: "",
        depts: [],
      }
    },
    async getUserInfo() {
      const result = await fetchUserInfo()
      if (result && result.uid) {
        this.$state = result
        return true
      }
      return false
    },
    async logoutConfirm() {
      const tagsViewStore = useTagView()
      const { removeToken, } = useToken()
      const result = await logout()
      if (result) {
        this.reset()
        removeToken()
        tagsViewStore.closeAll()
        location.reload()
      }
    },
  },
},)
