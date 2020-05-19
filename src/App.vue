<template>
  <div class="w-100 h-100 wrapper">
    <!-- 头部 start -->
    <van-nav-bar title="面具奇缘后台操作系统" right-text="按钮" @click-right="onClickRight">
      <template #right>
        <van-icon name="wap-nav" size="30" />
      </template>
    </van-nav-bar>
    <!-- 头部 end -->
    <!-- 主要内容区域 start -->
    <div class="main">
      <router-view />
    </div>
    <!-- 主要内容区域 end -->
    <!-- 侧边导航 start -->
    <van-popup v-model="show" position="left" :style="{ height: '100%' }">
      <van-cell-group title="功能">
        <van-sidebar v-model="activeKey" class="my-vant-sidebar">
          <van-sidebar-item
            v-for="item in sidebarList"
            :key="item.name"
            :title="item.meta.title"
            :to="item.path"
          />
        </van-sidebar>
      </van-cell-group>
    </van-popup>
    <!-- 侧边导航 end -->
  </div>
</template>

<script>
import { getSidebarList } from "@/router/sidebar";

export default {
  data() {
    return {
      show: false,
      sidebarList: getSidebarList(),
      activeKey: 0
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler(newRoute, oldRoute) {
        if (newRoute !== oldRoute) {
          // 只要索引，奇葩
          const {
            name,
            meta: { parentName }
          } = this.$route;
          this.activeKey = this.sidebarList.findIndex(
            item => item.name === name || item.name === parentName
          );
        }
      }
    }
  },
  methods: {
    onClickRight() {
      this.show = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  .main {
    flex-grow: 1;
    flex-shrink: 1;
    height: 100%;
    overflow-y: auto;
  }
}
</style>