<template>
	<div class="navbar">
		<hamburger
			:is-collapse="isCollapse"
			class="hamburger-container"
			@toggle-collapse="toggleCollapse"
		/>
		<breadcrumb />
		<div class="right-menu">
			<lang-select />
			<el-dropdown class="avatar-container" trigger="click">
				<div class="avatar-wrapper">
					<img :src="avatarUrl" class="user-avatar" />
				</div>
				<template #dropdown>
					<el-dropdown-menu class="user-dropdown">
						<router-link to="/">
							<el-dropdown-item>首页</el-dropdown-item>
						</router-link>
						<el-dropdown-item divided>
							<span class="block" @click="handleLogout">退出登录</span>
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
	</div>
</template>
<script setup>
import LangSelect from '@/components/LangSelect/index.vue';
import Hamburger from '@/components/Hamburger/index.vue';
import { useMenuStore } from '@/store/modules/menu';
import Breadcrumb from '@/components/Breadcrumb/index.vue';
import { useUserStore } from '@/store/modules/user';

defineOptions({
  name: 'Navbar',
});

const store = useMenuStore();

const { isCollapse } = storeToRefs(store);

const avatarUrl = computed(() => {
  return (
    useUserStore().avatarUrl ||
    'http://admin.spicyboy.cn/assets/gif/avatar-ea67286d.gif'
  );
});

const toggleCollapse = () => {
  store.setCollapse();
};

const handleLogout = async () => {
  const userStore = useUserStore();
  const { loginPage } = (await userStore.logout()) || {};
  if (loginPage) {
    location.replace(loginPage);
  } else {
    location.reload();
  }
};
</script>
<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    display: flex;
    align-items: center;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
