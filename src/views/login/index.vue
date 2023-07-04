<template>
	<div
		class="login-container h-full flex w-full flex-col justify-center items-center"
	>
		<div class="font-bold text-2xl text-white mb-5">Login Form</div>
		<el-form
			ref="loginFormRef"
			:model="loginForm"
			:rules="rules"
			class="w-1/3"
			size="large"
		>
			<el-form-item prop="username">
				<el-input
					v-model="loginForm.username"
					:prefix-icon="Avatar"
					placeholder="Username"
					clearable
					@keyup.enter="handleLogin"
				/>
			</el-form-item>
			<el-form-item prop="password">
				<el-input
					v-model="loginForm.password"
					:prefix-icon="Lock"
					placeholder="Password"
					clearable
					show-password
					@keyup.enter="handleLogin"
				/>
			</el-form-item>
			<el-button
				:loading="loading"
				class="w-full"
				type="primary"
				@click="handleLogin"
			>
				Login
			</el-button>
		</el-form>
	</div>
</template>

<script setup>
import { Avatar, Lock } from "@element-plus/icons-vue";
import { useUserStore } from "@/store/modules/user";

defineOptions({
  name: "Login"
});

const useLogin = () => {
  const route = useRoute();
  const router = useRouter();
  const loginFormRef = ref();
  const loading = ref(false);
  const redirect = ref(null);
  const store = useUserStore();
  const loginForm = reactive({
    username: "",
    password: ""
  });
  const rules = reactive({
    username: [
      {
        required: true,
        message: "请输入用户名"
      }
    ],
    password: [
      {
        required: true,
        message: "请输入密码"
      }
    ]
  });

  watch(
    route,
    () => {
      const { redirect: routeRedirect } = route.query;
      if (routeRedirect) {
        if (typeof routeRedirect === "string") {
          redirect.value = routeRedirect;
        } else {
          redirect.value = routeRedirect[0];
        }
      }
    },
    {
      immediate: true
    }
  );

  const handleLogin = () => {
    loginFormRef.value?.validate(async (valid) => {
      if (valid) {
        loading.value = true;
        const result = await store.login(loginForm);
        loading.value = false;
        if (result) {
          router.push({ path: redirect.value || "/" });
        }
      }
    });
  };

  return {
    rules,
    loading,
    loginForm,
    loginFormRef,
    handleLogin
  };
};

const { rules, loading, loginForm, loginFormRef, handleLogin } = useLogin();
</script>

<style scoped lang="scss">
.login-container {
  background-color: #2d3a4b;
}

:deep .el-input__wrapper {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(0, 0, 0, 0.1);
  caret-color: #fff;
  box-shadow: none !important;
}

:deep .el-input__inner {
  color: #fff;
}
</style>
